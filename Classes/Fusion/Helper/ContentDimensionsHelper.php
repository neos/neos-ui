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

use Neos\ContentRepository\Core\Dimension\ContentDimension;
use Neos\ContentRepository\Core\Dimension\ContentDimensionId;
use Neos\ContentRepository\Core\Dimension\ContentDimensionSourceInterface;
use Neos\ContentRepository\Core\DimensionSpace\AbstractDimensionSpacePoint;
use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;

class ContentDimensionsHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * @return array<string,array<string,mixed>> Dimensions indexed by name with presets indexed by name
     */
    public function contentDimensionsByName(ContentRepositoryId $contentRepositoryId): array
    {
        $contentDimensionHelperInternals = $this->contentRepositoryRegistry->getService($contentRepositoryId, new ContentDimensionsHelperInternalsFactory());
        assert($contentDimensionHelperInternals instanceof ContentDimensionsHelperInternals);
        $contentDimensionSource = $contentDimensionHelperInternals->contentDimensionSource;

        $dimensions = $contentDimensionSource->getContentDimensionsOrderedByPriority();

        $result = [];
        foreach ($dimensions as $dimension) {
            $result[$dimension->id->value] = [
                'label' => $dimension->getConfigurationValue('label'),
                'icon' => $dimension->getConfigurationValue('icon'),

                # TODO 'default' => $dimension->defaultValue->value,
                # TODO 'defaultPreset' => $dimension->defaultValue->value,
                'presets' => []
            ];

            foreach ($dimension->values as $value) {
                // TODO: make certain values hidable
                $result[$dimension->id->value]['presets'][$value->value] = [
                    // TODO: name, uriSegment!
                    'values' => [$value->value],
                    'label' => $value->getConfigurationValue('label')
                ];
            }
        }
        return $result;
    }

    /**
     * @param DimensionSpacePoint $dimensions Dimension values indexed by dimension name
     * @return array<string,array<int,string>> Allowed preset names for the given dimension combination
     *                                         indexed by dimension name
     */
    public function allowedPresetsByName(DimensionSpacePoint $dimensions, ContentRepositoryId $contentRepositoryId): array
    {
        $contentDimensionHelperInternals = $this->contentRepositoryRegistry->getService($contentRepositoryId, new ContentDimensionsHelperInternalsFactory());
        $contentDimensionSource = $contentDimensionHelperInternals->contentDimensionSource;

        // TODO: re-implement this here; currently EVERYTHING is allowed!!
        $allowedPresets = [];
        foreach ($dimensions->coordinates as $dimensionName => $dimensionValue) {
            $dimension = $contentDimensionSource->getDimension(new ContentDimensionId($dimensionName));
            if (!is_null($dimension)) {
                $value = $dimension->getValue($dimensionValue);
                if ($value !== null) {
                    $allowedPresets[$dimensionName] = array_keys($dimension->values->values);
                }
            }
        }

        return $allowedPresets;
    }

    public function dimensionSpacePointArray(AbstractDimensionSpacePoint $dimensionSpacePoint): array
    {
        return $dimensionSpacePoint->toLegacyDimensionArray();
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
