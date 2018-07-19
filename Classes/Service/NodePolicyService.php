<?php
namespace Neos\Neos\Ui\Service;

use Neos\ContentRepository\Domain\Projection\Content\ContentGraphInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\CreateNodePrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\CreateNodePrivilegeSubject;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePropertyPrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\NodePrivilegeSubject;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\PropertyAwareNodePrivilegeSubject;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\RemoveNodePrivilege;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Flow\Security\Authorization\Privilege\PrivilegeInterface;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\Flow\Security\Policy\PolicyService;
use Neos\Neos\Domain\Context\Content\NodeAddress;
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
     * @Flow\Inject
     * @var ContentGraphInterface
     */
    protected $contentGraph;

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
     * @param NodeAddress $nodeAddress
     * @return array
     */
    public function getNodePolicyInformation(NodeAddress $nodeAddress): array
    {
        return [
            'disallowedNodeTypes' => $this->getDisallowedNodeTypes($nodeAddress),
            'canRemove' => $this->canRemoveNode($nodeAddress),
            'canEdit' => $this->canEditNode($nodeAddress),
            'disallowedProperties' => $this->getDisallowedProperties($nodeAddress)
        ];
    }

    /**
     * @param NodeAddress $nodeAddress
     * @return bool
     */
    public function isNodeTreePrivilegeGranted(NodeAddress $nodeAddress): bool
    {
        if (!isset(self::getUsedPrivilegeClassNames($this->objectManager)[NodeTreePrivilege::class])) {
            return true;
        }

        return $this->privilegeManager->isGranted(
            NodeTreePrivilege::class,
            new NodePrivilegeSubject($nodeAddress)
        );
    }

    /**
     * @param NodeAddress $nodeAddress
     * @return array
     */
    public function getDisallowedNodeTypes(NodeAddress $nodeAddress): array
    {
        $disallowedNodeTypes = [];

        if (!isset(self::getUsedPrivilegeClassNames($this->objectManager)[CreateNodePrivilege::class])) {
            return $disallowedNodeTypes;
        }

        $filter = function ($nodeType) use ($nodeAddress) {
            return $this->privilegeManager->isGranted(
                CreateNodePrivilege::class,
                new CreateNodePrivilegeSubject($nodeAddress, $nodeType)
            );
        };

        $disallowedNodeTypeObjects = array_filter($this->nodeTypeManager->getNodeTypes(), $filter);

        $mapper = function ($nodeType) {
            return $nodeType->getName();
        };

        return array_map($mapper, $disallowedNodeTypeObjects);
    }

    /**
     * @param NodeAddress $nodeAddress
     * @return bool
     */
    public function canRemoveNode(NodeAddress $nodeAddress): bool
    {
        $canRemove = true;
        if (isset(self::getUsedPrivilegeClassNames($this->objectManager)[RemoveNodePrivilege::class])) {
            $canRemove = $this->privilegeManager->isGranted(RemoveNodePrivilege::class, new NodePrivilegeSubject($nodeAddress));
        }

        return $canRemove;
    }

    /**
     * @param NodeAddress $nodeAddress
     * @return bool
     */
    public function canEditNode(NodeAddress $nodeAddress): bool
    {
        $canEdit = true;
        if (isset(self::getUsedPrivilegeClassNames($this->objectManager)[EditNodePrivilege::class])) {
            $canEdit = $this->privilegeManager->isGranted(EditNodePrivilege::class, new NodePrivilegeSubject($nodeAddress));
        }

        return $canEdit;
    }

    /**
     * @param NodeAddress $nodeAddress
     * @return array
     */
    public function getDisallowedProperties(NodeAddress $nodeAddress): array
    {
        $disallowedProperties = [];

        if (!isset(self::getUsedPrivilegeClassNames($this->objectManager)[EditNodePropertyPrivilege::class])) {
            return $disallowedProperties;
        }

        $filter = function ($propertyName) use ($nodeAddress) {
            return $this->privilegeManager->isGranted(
                EditNodePropertyPrivilege::class,
                new PropertyAwareNodePrivilegeSubject($nodeAddress, null, $propertyName)
            );
        };

        $subgraph = $this->contentGraph->getSubgraphByIdentifier($nodeAddress->getContentStreamIdentifier(), $nodeAddress->getDimensionSpacePoint());
        $node = $subgraph->findNodeByNodeAggregateIdentifier($nodeAddress->getNodeAggregateIdentifier());

        $disallowedProperties = array_filter(array_keys($node->getNodeType()->getProperties()), $filter);
        return $disallowedProperties;
    }
}
