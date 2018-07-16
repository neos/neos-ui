<?php
namespace Neos\Neos\Ui\Fusion\Helper;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Context\Dimension\ContentDimensionSourceInterface;
use Neos\ContentRepository\Domain\Context\Dimension\ContentDimensionValue;
use Neos\ContentRepository\Domain\ValueObject\DimensionSpacePoint;
use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Neos\Domain\Service\ContentDimensionPresetSourceInterface;

class ContentDimensionsHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var ContentDimensionSourceInterface
     */
    protected $contentDimensionSource;

    /**
     * @return array Dimensions indexed by name with presets indexed by name
     */
    public function contentDimensionsByName()
    {
        $dimensions = $this->contentDimensionSource->getContentDimensionsOrderedByPriority();

        $result = [];
        foreach ($dimensions as $dimension) {
            $result[(string)$dimension->getIdentifier()] = [
                'label' => $dimension->getConfigurationValue('label'),
                'icon' => $dimension->getConfigurationValue('icon'),
                'defaultValue' => $dimension->getDefaultValue()->getValue(),
                'values' => []
            ];

            foreach ($dimension->getValues() as $value) {
                // TODO: make certain values hidable
                $result[(string)$dimension->getIdentifier()]['values'][$value->getValue()] = [
                    'value' => $value->getValue(),
                    'label' => $value->getConfigurationValue('label')
                ];
            }
        }
        return $result;
    }

    /**
     * @param array $dimensions Dimension values indexed by dimension name
     * @return array Allowed preset names for the given dimension combination indexed by dimension name
     */
    public function allowedPresetsByName(array $dimensions = null)
    {
        // TODO: fix allowedPresetsByName
        return [];
        $allowedPresets = [];
        $preselectedDimensionPresets = [];
        foreach ($dimensions as $dimensionName => $dimensionValues) {
            $preset = $this->contentDimensionSource->findPresetByDimensionValues($dimensionName, $dimensionValues);
            if ($preset !== null) {
                $preselectedDimensionPresets[$dimensionName] = $preset['identifier'];
            }
        }
        foreach ($preselectedDimensionPresets as $dimensionName => $presetName) {
            $presets = $this->contentDimensionSource->getAllowedDimensionPresetsAccordingToPreselection($dimensionName, $preselectedDimensionPresets);
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
