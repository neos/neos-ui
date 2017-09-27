<?php
namespace Neos\Neos\Ui\View;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".           *
 *                                                                        *
 *                                                                        */
use Neos\Flow\Annotations as Flow;
use Neos\Fusion\View\FusionView;

class BackendFusionView extends FusionView
{
    public function __construct(array $options = array())
    {
        parent::__construct($options);
        $this->setFusionPathPattern('resource://Neos.Neos.Ui/Private/Fusion/Backend');
    }
}
