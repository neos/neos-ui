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

use Neos\ContentRepository\DimensionSpace\Dimension\ContentDimensionSourceInterface;
use Neos\ContentRepository\Factory\ContentRepositoryServiceInterface;

/**
 * @deprecated ugly - we want to get rid of this by adding dimension infos in the Subgraph
 */
class ContentDimensionsHelperInternals implements ContentRepositoryServiceInterface
{

    public function __construct(
        public readonly ContentDimensionSourceInterface $contentDimensionSource
    ) {
    }
}
