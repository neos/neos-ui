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

use Neos\Flow\Mvc\View\AbstractView;
use Neos\Flow\Annotations as Flow;

class OutOfBandRenderingViewFactory
{
    /**
     * @phpstan-var class-string
     */
    #[Flow\InjectConfiguration(path: 'outOfBandRendering.viewObjectName')]
    protected string $viewObjectName;

    public function resolveView(): AbstractView&OutOfBandRenderingCapable
    {
        if (!class_exists($this->viewObjectName)) {
            throw new \DomainException(
                'Declared view for out of band rendering (' . $this->viewObjectName . ') does not exist',
                1697821296
            );
        }
        $view = new $this->viewObjectName();
        if (!$view instanceof AbstractView) {
            throw new \DomainException(
                'Declared view (' . $this->viewObjectName . ') does not implement ' . AbstractView::class
                . ' required for out-of-band rendering',
                1697821429
            );
        }
        if (!$view instanceof OutOfBandRenderingCapable) {
            throw new \DomainException(
                'Declared view (' . $this->viewObjectName . ') does not implement ' . OutOfBandRenderingCapable::class
                . ' required for out-of-band rendering',
                1697821364
            );
        }

        return $view;
    }
}
