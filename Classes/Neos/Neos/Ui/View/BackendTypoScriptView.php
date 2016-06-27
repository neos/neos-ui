<?php
namespace Neos\Neos\Ui\View;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "PackageFactory.Guevara".*
 *                                                                        *
 *                                                                        */
use TYPO3\Flow\Annotations as Flow;
use TYPO3\TypoScript\View\TypoScriptView;

class BackendTypoScriptView extends TypoScriptView
{

    public function __construct(array $options = array())
    {
        parent::__construct($options);
        $this->setTypoScriptPathPattern('resource://PackageFactory.Guevara/Private/TypoScript/Backend');
    }
}
