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

namespace Neos\Neos\Ui\View;

use Neos\Neos\View\FusionView;

/**
 * A Fusion view capable of out-of-band rendering
 */
class OutOfBandRenderingFusionView extends FusionView implements OutOfBandRenderingCapable
{
    public function setRenderingEntryPoint(string $renderingEntryPoint): void
    {
        $this->setFusionPath($renderingEntryPoint);
    }
}
