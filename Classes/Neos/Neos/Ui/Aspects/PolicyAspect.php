<?php
namespace Neos\Neos\Ui\Aspects;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".          *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\Neos\Security\Authorization\Privilege\NodeTreePrivilege;
use Neos\Neos\Security\Authorization\Privilege\CreateNodePrivilege;
use Neos\Neos\Security\Authorization\Privilege\RemoveNodePrivilege;
use Neos\Neos\Security\Authorization\Privilege\EditNodePrivilege;
use Neos\Neos\Security\Authorization\Privilege\ReadNodePrivilege;
use Neos\Neos\Security\Authorization\Privilege\EditNodePropertyPrivilege;

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
     * @Flow\Around("method()")
     * @return void
     */
    public function enforceNodeTreePrivilege(JoinPointInterface $joinPoint)
    {
    }

    /**
     * @Flow\Around("method()")
     * @return void
     */
    public function enforceCreateNodePrivilege(JoinPointInterface $joinPoint)
    {
    }

    /**
     * @Flow\Around("method()")
     * @return void
     */
    public function enforceRemoveNodePrivilege(JoinPointInterface $joinPoint)
    {
    }

    /**
     * @Flow\Around("method()")
     * @return void
     */
    public function enforceEditNodePrivilege(JoinPointInterface $joinPoint)
    {
    }

    /**
     * @Flow\Around("method()")
     * @return void
     */
    public function enforceReadNodePrivilege(JoinPointInterface $joinPoint)
    {
    }

    /**
     * @Flow\Around("method()")
     * @return void
     */
    public function enforceEditNodePropertyPrivilege(JoinPointInterface $joinPoint)
    {
    }
}
