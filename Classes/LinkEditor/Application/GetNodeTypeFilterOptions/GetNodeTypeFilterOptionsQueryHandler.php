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

namespace Neos\Neos\Ui\LinkEditor\Application\GetNodeTypeFilterOptions;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\NodeTypeServiceFactory;
use Neos\Neos\Ui\LinkEditor\Presentation\Option\Options;
use Neos\Neos\Ui\LinkEditor\Presentation\Option\OptionsFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetNodeTypeFilterOptionsQueryHandler
{
    /** @var array<string,array<mixed>> */
    #[Flow\InjectConfiguration(package: 'Neos.Neos', path: 'userInterface.navigateComponent.nodeTree.presets')]
    protected array $nodeTreePresets;

    #[Flow\Inject]
    protected NodeTypeServiceFactory $nodeTypeServiceFactory;

    #[Flow\Inject]
    protected OptionsFactory $optionsFactory;

    public function handle(GetNodeTypeFilterOptionsQuery $query): GetNodeTypeFilterOptionsQueryResult
    {
        return new GetNodeTypeFilterOptionsQueryResult(
            options: $this->thereAreNodeTreePresetsOtherThanDefault()
                ? $this->renderOptionsForNodeTreePresets()
                : $this->renderOptionsForNodeTypes($query),
        );
    }

    private function thereAreNodeTreePresetsOtherThanDefault(): bool
    {
        $defaultExists = isset($this->nodeTreePresets['default']);
        $numberOfPresets = count($this->nodeTreePresets);

        return ($defaultExists && $numberOfPresets > 1)
            || (!$defaultExists && $numberOfPresets > 0);
    }

    private function renderOptionsForNodeTreePresets(): Options
    {
        return $this->optionsFactory->forNodeTreePresets($this->nodeTreePresets);
    }

    private function renderOptionsForNodeTypes(GetNodeTypeFilterOptionsQuery $query): Options
    {
        $nodeTypeService = $this->nodeTypeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
        );

        return $this->optionsFactory->forNodeTypes(
            ...$nodeTypeService->getAllNodeTypesMatching($query->baseNodeTypeFilter)
        );
    }
}
