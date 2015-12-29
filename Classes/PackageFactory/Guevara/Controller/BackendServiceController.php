<?php
namespace PackageFactory\Guevara\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "PackageFactory.Guevara".*
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\ActionController;
use PackageFactory\Guevara\Domain\Model\ChangeCollection;
use PackageFactory\Guevara\Domain\Model\FeedbackCollection;
use PackageFactory\Guevara\Domain\Model\Feedback\Messages\Error;
use PackageFactory\Guevara\Domain\Model\Feedback\Messages\Info;

class BackendServiceController extends ActionController
{

    /**
     * @var array
     */
    protected $supportedMediaTypes = ['application/json'];

    /**
     * @var string
     */
    protected $defaultViewObjectName = \TYPO3\Flow\Mvc\View\JsonView::class;

    /**
     * Apply a set of changes to the system
     *
     * @param ChangeCollection $changes
     * @return void
     */
    public function changeAction(ChangeCollection $changes)
    {
        $feedbackCollection = new FeedbackCollection();

        try {
            $count = $changes->count();
            $changes->compress()->apply();

            $success = new Info();
            $success->setMessage(sprintf('%d change(s) successfully applied.', $count));

            $feedbackCollection->add($success);
        } catch(\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $feedbackCollection->add($error);
        }

        $this->view->assign('value', $feedbackCollection);
    }

}
