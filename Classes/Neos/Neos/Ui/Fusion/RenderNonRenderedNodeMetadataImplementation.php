<?php
namespace Neos\Neos\Ui\Fusion;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

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
        return $this->augmentedAspect->getNonRenderedContentNodeMetadata($this->fusionValue('node'));
    }
}
