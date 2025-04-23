<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Application\GetChildrenForTreeNode\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Application\GetChildrenForTreeNode\GetChildrenForTreeNodeQuery;
use Neos\Neos\Ui\Application\GetChildrenForTreeNode\GetChildrenForTreeNodeQueryHandler;
use Neos\Neos\Ui\Application\Shared\NodeWasNotFound;
use Neos\Neos\Ui\Framework\MVC\QueryController;
use Neos\Neos\Ui\Framework\MVC\QueryResponse;

#[Flow\Scope("singleton")]
final class GetChildrenForTreeNodeController extends QueryController
{
    #[Flow\Inject]
    protected GetChildrenForTreeNodeQueryHandler $queryHandler;

    public function processQuery(array $arguments): QueryResponse
    {
        try {
            $query = GetChildrenForTreeNodeQuery::fromArray($arguments);
            $queryResult = $this->queryHandler->handle($query);

            return QueryResponse::success($queryResult);
        } catch (NodeWasNotFound $e) {
            return QueryResponse::clientError($e);
        }
    }
}
