<?php
namespace Neos\Neos\Ui\Aspects;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".          *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\NodePrivilegeSubject;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\CreateNodePrivilegeSubject;
use Neos\Neos\Security\Authorization\Privilege\NodeTreePrivilege;
use Neos\Neos\Security\Authorization\Privilege\ReadNodePrivilege;
use Neos\Neos\Security\Authorization\Privilege\EditNodePropertyPrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\CreateNodePrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\RemoveNodePrivilege;
use Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege;

/**
 * Add information to rendered nodes relevant to enforce the following privileges
 * in the UI:
 *
 * - NodeTreePrivilege
 * - CreateNodePrivilege
 * - RemoveNodePrivilege
 * - EditNodePrivilege
 * - ReadNodePrivilege
 * - EditNodePropertyPrivilege
 *
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class PolicyAspect
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
     * @Flow\Around("method(Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper->renderNode())")
     * @return void
     */
    public function enforceNodeTreePrivilege(JoinPointInterface $joinPoint)
    {
        $node = $joinPoint->getMethodArgument('node');
        $hasNodeTreePrivilege = $this->privilegeManager->isGranted(
            NodeTreePrivilege::class,
            new NodePrivilegeSubject($node)
        );

        if ($hasNodeTreePrivilege) {
            return $joinPoint->getAdviceChain()->proceed($joinPoint);
        }
    }

    /**
     * @Flow\Around("method(Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper->renderNode())")
     * @return void
     */
    public function enforceCreateNodePrivilege(JoinPointInterface $joinPoint)
    {
        $node = $joinPoint->getMethodArgument('node');
        $nodeInfo = $joinPoint->getAdviceChain()->proceed($joinPoint);

        $nodeInfo['policy'] = array_key_exists('policy', $nodeInfo) ? $nodeInfo['policy'] : [];
        $nodeInfo['policy']['disallowedNodeTypes'] = [];

        foreach ($this->nodeTypeManager->getNodeTypes() as $nodeType) {
            $canCreate = $this->privilegeManager->isGranted(
                CreateNodePrivilege::class,
                new CreateNodePrivilegeSubject($node, $nodeType)
            );

            if (!$canCreate) {
                $nodeInfo['policy']['disallowedNodeTypes'][] = $nodeType->getName();
            }
        }

        return $nodeInfo;
    }

    /**
     * @Flow\Around("method(Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper->renderNode())")
     * @return array
     */
    public function enforceRemoveNodePrivilege(JoinPointInterface $joinPoint)
    {
        $node = $joinPoint->getMethodArgument('node');
        $nodeInfo = $joinPoint->getAdviceChain()->proceed($joinPoint);

        $canRemove = $this->privilegeManager->isGranted(RemoveNodePrivilege::class, new NodePrivilegeSubject($node));

        $nodeInfo['policy'] = array_key_exists('policy', $nodeInfo) ? $nodeInfo['policy'] : [];
        $nodeInfo['policy']['canRemove'] = $canRemove;

        return $nodeInfo;
    }

    /**
     * @Flow\Around("method(Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper->renderNode())")
     * @return array
     */
    public function enforceEditNodePrivilege(JoinPointInterface $joinPoint)
    {
        $node = $joinPoint->getMethodArgument('node');
        $nodeInfo = $joinPoint->getAdviceChain()->proceed($joinPoint);

        $canEdit = $this->privilegeManager->isGranted(EditNodePrivilege::class, new NodePrivilegeSubject($node));

        $nodeInfo['policy'] = array_key_exists('policy', $nodeInfo) ? $nodeInfo['policy'] : [];
        $nodeInfo['policy']['canEdit'] = $canEdit;

        return $nodeInfo;
    }

    /**
     * @Flow\Around("method()")
     * @return void
     */
    public function enforceEditNodePropertyPrivilege(JoinPointInterface $joinPoint)
    {
    }
}
