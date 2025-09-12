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

namespace Neos\Neos\Ui\LinkEditor\Application\GetNodeTypeFilterOptions\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\LinkEditor\Application\GetNodeTypeFilterOptions\GetNodeTypeFilterOptionsQuery;
use Neos\Neos\Ui\LinkEditor\Application\GetNodeTypeFilterOptions\GetNodeTypeFilterOptionsQueryHandler;
use Neos\Neos\Ui\LinkEditor\Framework\MVC\QueryController;
use Neos\Neos\Ui\LinkEditor\Framework\MVC\QueryResponse;

#[Flow\Scope("singleton")]
final class GetNodeTypeFilterOptionsController extends QueryController
{
    #[Flow\Inject]
    protected GetNodeTypeFilterOptionsQueryHandler $queryHandler;

    public function processQuery(array $arguments): QueryResponse
    {
        $query = GetNodeTypeFilterOptionsQuery::fromArray($arguments);
        $queryResult = $this->queryHandler->handle($query);

        return QueryResponse::createSuccess($queryResult);
    }
}
