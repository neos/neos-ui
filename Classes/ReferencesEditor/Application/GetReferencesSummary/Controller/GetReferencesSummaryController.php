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

namespace Neos\Neos\Ui\ReferencesEditor\Application\GetReferencesSummary\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\ReferencesEditor\Application\GetReferencesSummary\GetReferencesSummaryQuery;
use Neos\Neos\Ui\ReferencesEditor\Application\GetReferencesSummary\GetReferencesSummaryQueryHandler;
// todo unhack me
use Neos\Neos\Ui\LinkEditor\Application\Shared\NodeWasNotFound;
use Neos\Neos\Ui\LinkEditor\Framework\MVC\QueryController;
use Neos\Neos\Ui\LinkEditor\Framework\MVC\QueryResponse;

#[Flow\Scope("singleton")]
final class GetReferencesSummaryController extends QueryController
{
    #[Flow\Inject]
    protected GetReferencesSummaryQueryHandler $queryHandler;

    public function processQuery(array $arguments): QueryResponse
    {
        try {
            $query = GetReferencesSummaryQuery::fromArray($arguments);
            $queryResult = $this->queryHandler->handle($query);

            return QueryResponse::createSuccess($queryResult);
        } catch (NodeWasNotFound $e) {
            return QueryResponse::createServerSideErrorForBadRequest($e);
        }
    }
}
