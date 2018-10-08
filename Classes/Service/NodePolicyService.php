<?php
namespace Neos\Neos\Ui\Service;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePropertyPrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\NodePrivilegeSubject;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\PropertyAwareNodePrivilegeSubject;
use Neos\ContentRepository\Service\AuthorizationService;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Flow\Security\Authorization\Privilege\PrivilegeInterface;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\Flow\Security\Context as SecurityContext;
use Neos\Flow\Security\Policy\PolicyService;
use Neos\Neos\Security\Authorization\Privilege\NodeTreePrivilege;

/**
 * @Flow\Scope("singleton")
 */
class NodePolicyService
{
    /**
     * @Flow\Inject
     * @var AuthorizationService
     */
    protected $authorizationService;

    /**
     * @Flow\Inject
     * @var PrivilegeManagerInterface
     */
    protected $privilegeManager;

    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * @Flow\Inject
     * @var ObjectManagerInterface
     */
    protected $objectManager;

    /**
     * @Flow\Inject
     * @var SecurityContext
     */
    protected $securityContext;

    /**
     * @param ObjectManagerInterface $objectManager
     * @return array the key is a Privilege class name; the value is "true" if privileges are configured for this class name.
     * @Flow\CompileStatic
     */
    public static function getUsedPrivilegeClassNames(ObjectManagerInterface $objectManager): array
    {
        $policyService = $objectManager->get(PolicyService::class);
        $usedPrivilegeClassNames = [];
        foreach ($policyService->getPrivilegeTargets() as $privilegeTarget) {
            $usedPrivilegeClassNames[$privilegeTarget->getPrivilegeClassName()] = true;
            foreach (class_parents($privilegeTarget->getPrivilegeClassName()) as $parentPrivilege) {
                if (is_a($parentPrivilege, PrivilegeInterface::class)) {
                    $usedPrivilegeClassNames[$parentPrivilege] = true;
                }
            }
        }

        return $usedPrivilegeClassNames;
    }

    /**
     * @param NodeInterface $node
     * @return array
     */
    public function getNodePolicyInformation(NodeInterface $node): array
    {
        return [
            'disallowedNodeTypes' => $this->getDisallowedNodeTypes($node),
            'canRemove' => $this->canRemoveNode($node),
            'canEdit' => $this->canEditNode($node),
            'disallowedProperties' => $this->getDisallowedProperties($node)
        ];
    }

    /**
     * @param NodeInterface $node
     * @return bool
     */
    public function isNodeTreePrivilegeGranted(NodeInterface $node): bool
    {
        if (!isset(self::getUsedPrivilegeClassNames($this->objectManager)[NodeTreePrivilege::class])) {
            return true;
        }

        return $this->privilegeManager->isGranted(
            NodeTreePrivilege::class,
            new NodePrivilegeSubject($node)
        );
    }

    /**
     * @param NodeInterface $node
     * @return string[]
     */
    public function getDisallowedNodeTypes(NodeInterface $node): array
    {
        return $this->authorizationService->getNodeTypeNamesDeniedForCreation($node);
    }

    /**
     * @param NodeInterface $node
     * @return bool
     */
    public function canRemoveNode(NodeInterface $node): bool
    {
        return $this->authorizationService->isGrantedToRemoveNode($node);
    }

    /**
     * @param NodeInterface $node
     * @return bool
     */
    public function canEditNode(NodeInterface $node): bool
    {
        return $this->authorizationService->isGrantedToEditNode($node);
    }

    /**
     * @param NodeInterface $node
     * @return string[]
     */
    public function getDisallowedProperties(NodeInterface $node): array
    {
        if ($this->canEditNode($node)) {
            return $this->authorizationService->getDeniedNodePropertiesForEditing($node);
        }

        // If node editing was denied explicitly, property editing privilege can't overwrite
        $privilegeSubject = new NodePrivilegeSubject($node);
        foreach ($this->securityContext->getRoles() as $role) {
            /** @var PrivilegeInterface[] $effectivePrivileges */
            foreach ($role->getPrivilegesByType(EditNodePrivilege::class) as $privilege) {
                if ($privilege->matchesSubject($privilegeSubject) && $privilege->isDenied()) {
                    return array_keys($node->getNodeType()->getProperties());
                }
            }
        }

        // Matching node editing privileges only abstained
        // Filter out node properties where editing is explicitly granted
        $filter = function (string $propertyName) use ($node) {
            $privilegeSubject = new PropertyAwareNodePrivilegeSubject($node, null, $propertyName);
            $grants = 0;
            foreach ($this->securityContext->getRoles() as $role) {
                /** @var PrivilegeInterface[] $effectivePrivileges */
                foreach ($role->getPrivilegesByType(EditNodePropertyPrivilege::class) as $privilege) {
                    if ($privilege->matchesSubject($privilegeSubject)) {
                        if ($privilege->isDenied()) {
                            return true;
                        }
                        if ($privilege->isGranted()) {
                            $grants++;
                        }
                    }
                }
            }

            return $grants === 0;
        };

        return array_filter(array_keys($node->getNodeType()->getProperties()), $filter);
    }
}
