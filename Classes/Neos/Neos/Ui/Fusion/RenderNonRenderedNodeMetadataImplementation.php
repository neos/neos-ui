<?php
namespace Neos\Neos\Ui\Fusion;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\FusionObjects\AbstractFusionObject;
use Neos\Neos\Ui\Aspects\AugmentationAspect;

/**
 * Implementation to return the metadata for non rendered nodes.
 */
class RenderNonRenderedNodeMetadataImplementation extends AbstractFusionObject
{
    /**
     * @Flow\Inject
     * @var AugmentationAspect
     */
    protected $augmentedAspect;

    public function evaluate()
    {
        return $this->augmentedAspect->appendNonRenderedContentNodeMetadata($this->fusionValue('node'));
    }
}
