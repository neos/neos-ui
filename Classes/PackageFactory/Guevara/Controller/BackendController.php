<?php
namespace PackageFactory\Guevara\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "PackageFactory.Guevara".*
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\ActionController;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

class BackendController extends ActionController
{

    /**
     * Displays the backend interface
     *
     * @param NodeInterface $node The node that will be displayed on the first tab
     * @return void
     */
    public function indexAction(NodeInterface $node)
    {
      	$this->view->assign('node', $node);
    }

}
