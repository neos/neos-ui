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

namespace Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\NodeType\NodeTypeNames;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\NodeType\NodeTypeCriteria;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\LinkEditor\Application\Shared\NodeTypeWasNotFound;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeTypeService
{
    public function __construct(
        private readonly ContentRepository $contentRepository,
    ) {
    }

    public function requireNodeTypeByName(NodeTypeName $nodeTypeName): NodeType
    {
        $nodeType = $this->contentRepository->getNodeTypeManager()->getNodeType($nodeTypeName);
        if ($nodeType === null) {
            throw NodeTypeWasNotFound::becauseNodeTypeWithGivenNameDoesNotExistInCurrentSchema(
                nodeTypeName: $nodeTypeName,
                contentRepositoryId: $this->contentRepository->id,
            );
        }

        return $nodeType;
    }

    /** @return NodeType[] */
    public function getAllNodeTypesMatching(NodeTypeCriteria $nodeTypeCriteria): array
    {
        $nodeTypeManager = $this->contentRepository->getNodeTypeManager();
        $explicitlyAllowedNodeTypeNames = $nodeTypeCriteria->explicitlyAllowedNodeTypeNames->toStringArray();
        $explicitlyDisallowedNodeTypeNames = $nodeTypeCriteria->explicitlyDisallowedNodeTypeNames->toStringArray();
        $isEmpty =  $nodeTypeCriteria->explicitlyAllowedNodeTypeNames->isEmpty()
            && $nodeTypeCriteria->explicitlyDisallowedNodeTypeNames->isEmpty();

        $result = [];
        foreach ($nodeTypeManager->getNodeTypes(false) as $candidateNodeType) {
            if ($isEmpty) {
                $result[] = $candidateNodeType;
                continue;
            }

            foreach ($explicitlyDisallowedNodeTypeNames as $disallowedNodeTypeName) {
                if ($candidateNodeType->isOfType($disallowedNodeTypeName)) {
                    continue 2;
                }
            }

            foreach ($explicitlyAllowedNodeTypeNames as $allowedNodeTypeName) {
                if ($candidateNodeType->isOfType($allowedNodeTypeName)) {
                    $result[] = $candidateNodeType;
                    continue 2;
                }
            }
        }

        return $result;
    }

    public function createNodeTypeFilterFromFilterString(string $filterString): NodeTypeFilter
    {
        $nodeTypeManager = $this->contentRepository->getNodeTypeManager();
        $nodeTypeCriteria = NodeTypeCriteria::fromFilterString($filterString);
        $explicitlyAllowedNodeTypeNames = $nodeTypeCriteria->explicitlyAllowedNodeTypeNames->toStringArray();
        $explicitlyDisallowedNodeTypeNames = $nodeTypeCriteria->explicitlyDisallowedNodeTypeNames->toStringArray();
        $isEmpty = $nodeTypeCriteria->explicitlyAllowedNodeTypeNames->isEmpty()
            && $nodeTypeCriteria->explicitlyDisallowedNodeTypeNames->isEmpty();

        $allowedNodeTypeNames = [];
        foreach ($nodeTypeManager->getNodeTypes(true) as $candidateNodeType) {
            if ($isEmpty) {
                $allowedNodeTypeNames[] = $candidateNodeType->name;
                continue;
            }

            foreach ($explicitlyDisallowedNodeTypeNames as $disallowedNodeTypeName) {
                if ($candidateNodeType->isOfType($disallowedNodeTypeName)) {
                    continue 2;
                }
            }

            foreach ($explicitlyAllowedNodeTypeNames as $allowedNodeTypeName) {
                if ($candidateNodeType->isOfType($allowedNodeTypeName)) {
                    $allowedNodeTypeNames[] = $candidateNodeType->name;
                    continue 2;
                }
            }
        }

        return new NodeTypeFilter(
            nodeTypeCriteria: $nodeTypeCriteria,
            allowedNodeTypeNames: NodeTypeNames::fromArray($allowedNodeTypeNames)
        );
    }

    public function createNodeTypeFilterFromNodeTypeNames(NodeTypeNames $nodeTypeNames): NodeTypeFilter
    {
        $nodeTypeManager = $this->contentRepository->getNodeTypeManager();
        $isEmpty = $nodeTypeNames->isEmpty();

        $allowedNodeTypeNames = [];
        foreach ($nodeTypeManager->getNodeTypes(true) as $candidateNodeType) {
            if ($isEmpty) {
                $allowedNodeTypeNames[] = $candidateNodeType->name;
                continue;
            }

            foreach ($nodeTypeNames as $nodeTypeName) {
                if ($candidateNodeType->isOfType($nodeTypeName)) {
                    $allowedNodeTypeNames[] = $candidateNodeType->name;
                    continue 2;
                }
            }
        }

        return new NodeTypeFilter(
            nodeTypeCriteria: NodeTypeCriteria::createWithAllowedNodeTypeNames($nodeTypeNames),
            allowedNodeTypeNames: NodeTypeNames::fromArray($allowedNodeTypeNames)
        );
    }
}
