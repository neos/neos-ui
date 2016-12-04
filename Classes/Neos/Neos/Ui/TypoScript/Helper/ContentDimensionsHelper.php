<?php
namespace Neos\Neos\Ui\TypoScript\Helper;

use Neos\Flow\Annotations as Flow;
use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\Neos\Domain\Service\ContentDimensionPresetSourceInterface;

class ContentDimensionsHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var ContentDimensionPresetSourceInterface
     */
    protected $contentDimensionsPresetSource;

    /**
     * @return array Dimensions indexed by name with presets indexed by name
     */
    public function contentDimensionsByName() {
        return $this->contentDimensionsPresetSource->getAllPresets();
    }

    /**
     * @param array $dimensions Dimension values indexed by dimension name
     * @return array Allowed preset names for the given dimension combination indexed by dimension name
     */
    public function allowedPresetsByName(array $dimensions) {
        $allowedPresets = array();
        $preselectedDimensionPresets = array();
        foreach ($dimensions as $dimensionName => $dimensionValues) {
            $preset = $this->contentDimensionsPresetSource->findPresetByDimensionValues($dimensionName, $dimensionValues);
            if ($preset !== null) {
                $preselectedDimensionPresets[$dimensionName] = $preset['identifier'];
            }
        }
        foreach ($preselectedDimensionPresets as $dimensionName => $presetName) {
            $presets = $this->contentDimensionsPresetSource->getAllowedDimensionPresetsAccordingToPreselection($dimensionName, $preselectedDimensionPresets);
            $allowedPresets[$dimensionName] = array_keys($presets[$dimensionName]['presets']);
        }
        return $allowedPresets;
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
