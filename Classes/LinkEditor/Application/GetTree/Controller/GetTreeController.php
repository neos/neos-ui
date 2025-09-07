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

namespace Neos\Neos\Ui\LinkEditor\Application\GetTree\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\LinkEditor\Application\GetTree\GetTreeQuery;
use Neos\Neos\Ui\LinkEditor\Application\GetTree\GetTreeQueryHandler;
use Neos\Neos\Ui\LinkEditor\Application\GetTree\StartingPointWasNotFound;
use Neos\Neos\Ui\LinkEditor\Framework\MVC\QueryController;
use Neos\Neos\Ui\LinkEditor\Framework\MVC\QueryResponse;

#[Flow\Scope("singleton")]
final class GetTreeController extends QueryController
{
    #[Flow\Inject]
    protected GetTreeQueryHandler $queryHandler;

    public function processQuery(array $arguments): QueryResponse
    {
        try {
            $query = GetTreeQuery::fromArray($arguments);
            $queryResult = $this->queryHandler->handle($query);

            return QueryResponse::success($queryResult);
        } catch (StartingPointWasNotFound $e) {
            return QueryResponse::clientError($e);
        }
    }
}
