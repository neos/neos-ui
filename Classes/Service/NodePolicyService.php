<?php
namespace Neos\Neos\Ui\Service;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\CreateNodePrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\CreateNodePrivilegeSubject;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePropertyPrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\NodePrivilegeSubject;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\PropertyAwareNodePrivilegeSubject;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\RemoveNodePrivilege;
use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Flow\Security\Authorization\Privilege\PrivilegeInterface;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\Flow\Security\Policy\PolicyService;
use Neos\Neos\Security\Authorization\Privilege\NodeTreePrivilege;

/**
 * @Flow\Scope("singleton")
 */
class NodePolicyService
{

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
     * @param ObjectManagerInterface $objectManager
     * @return array the key is a Privilege class name; the value is "true" if privileges are configured for this class name.
     * @Flow\CompileStatic
     */
    public static function getUsedPrivilegeClassNames($objectManager)
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
        $hasNodeTreePrivilege = $this->privilegeManager->isGranted(
            NodeTreePrivilege::class,
            new NodePrivilegeSubject($node)
        );

        if ($hasNodeTreePrivilege) {
            return true;
        }

        return false;
    }

    /**
     * @param NodeInterface $node
     * @return array
     */
    public function getDisallowedNodeTypes(NodeInterface $node): array
    {
        $disallowedNodeTypes = [];
        // performance optimization: we ensure that CreateNodePrivilege is actually used before running this code
        if (isset(self::getUsedPrivilegeClassNames($this->objectManager)[CreateNodePrivilege::class])) {
            /** @var NodeType $nodeType */
            foreach ($this->nodeTypeManager->getNodeTypes() as $nodeType) {
                $canCreate = $this->privilegeManager->isGranted(
                    CreateNodePrivilege::class,
                    new CreateNodePrivilegeSubject($node, $nodeType)
                );

                if (!$canCreate) {
                    $disallowedNodeTypes[] = $nodeType->getName();
                }
            }
        }

        return $disallowedNodeTypes;
    }

    /**
     * @param NodeInterface $node
     * @return bool
     */
    public function canRemoveNode(NodeInterface $node): bool
    {

        if (isset(self::getUsedPrivilegeClassNames($this->objectManager)[RemoveNodePrivilege::class])) {
            $canRemove = $this->privilegeManager->isGranted(RemoveNodePrivilege::class, new NodePrivilegeSubject($node));
        } else {
            $canRemove = true;
        }

        return $canRemove;
    }

    /**
     * @param NodeInterface $node
     * @return bool
     */
    public function canEditNode(NodeInterface $node): bool
    {
        if (isset(self::getUsedPrivilegeClassNames($this->objectManager)[EditNodePrivilege::class])) {
            $canEdit = $this->privilegeManager->isGranted(EditNodePrivilege::class, new NodePrivilegeSubject($node));
        } else {
            $canEdit = true;
        }

        return $canEdit;
    }

    /**
     * @param NodeInterface $node
     * @return array
     */
    public function getDisallowedProperties(NodeInterface $node): array
    {
        $disallowedProperties = [];

        if (isset(self::getUsedPrivilegeClassNames($this->objectManager)[EditNodePropertyPrivilege::class])) {
            foreach ($node->getNodeType()->getProperties() as $propertyName => $propertyConfiguration) {
                $canEdit = $this->privilegeManager->isGranted(
                    EditNodePropertyPrivilege::class,
                    new PropertyAwareNodePrivilegeSubject($node, null, $propertyName)
                );

                if (!$canEdit) {
                    $disallowedProperties[] = $propertyName;
                }
            }
        }

        return $disallowedProperties;
    }
}
