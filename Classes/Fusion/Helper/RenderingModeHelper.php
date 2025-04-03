<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\Fusion\Helper;

use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Model\RenderingMode;
use Neos\Neos\Domain\Service\RenderingModeService;
use Neos\Utility\PositionalArraySorter;

/**
 * @internal implementation detail of the Neos Ui to build its initialState.
 *           only used in EEL for the configuration Neos.Neos.Ui.initialState.
 */
final class RenderingModeHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\InjectConfiguration(path="userInterface.editPreviewModes", package="Neos.Neos")
     * @var array<string,mixed>
     */
    protected $editPreviewModes;

    /**
     * Returns the sorted configuration of all rendering modes {@see RenderingMode}
     *
     * TODO evaluate if this should be part of {@see RenderingModeService}
     *
     * @return array<string,array<mixed>>
     */
    public function findAllSorted(): array
    {
        // sorting seems expected for the Neos.Ui: https://github.com/neos/neos-ui/issues/1658
        return (new PositionalArraySorter($this->editPreviewModes))->toArray();
    }

    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
