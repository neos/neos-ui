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

namespace Neos\Neos\Ui\Application\Query\GetInspector;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Application\Dto\Property\PropertiesDtoFactory;
use Neos\Neos\Ui\Application\Dto\Select\SelectDtoFactory;
use Neos\Neos\Ui\Application\Dto\Tab\TabsDtoFactory;
use Neos\Neos\Ui\ContentRepository\Service\NodeService;

#[Flow\Scope("singleton")]
final class GetInspectorQueryHandler
{
    #[Flow\Inject]
    protected NodeService $nodeService;

    #[Flow\Inject]
    protected TabsDtoFactory $tabsDtoFactory;

    #[Flow\Inject]
    protected SelectDtoFactory $selectDtoFactory;

    #[Flow\Inject]
    protected PropertiesDtoFactory $propertiesDtoFactory;

    public function handle(GetInspectorQuery $query): GetInspectorQueryResult
    {
        $node = $this->nodeService->getNodeFromContextPath($query->nodeContextPath);

        return new GetInspectorQueryResult(
            tabs: $this->tabsDtoFactory->fromNodeType($node->getNodeType()),
            selectedElement: $this->selectDtoFactory->fromNodeForSelectedElement($node),
            properties: $this->propertiesDtoFactory->fromNode($node),
        );
    }
}
