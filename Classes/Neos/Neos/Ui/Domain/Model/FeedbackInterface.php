<?php
namespace Neos\Neos\Ui\Domain\Model;

use TYPO3\Flow\Mvc\Controller\ControllerContext;

interface FeedbackInterface
{
    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType();

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription();

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback);

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext);
}
