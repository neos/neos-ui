<?php
namespace Neos\Neos\Ui\Domain\Model;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Mvc\Controller\ControllerContext;

interface FeedbackInterface
{
    /**
     * main entry point for serializing the feedback before it is sent to the UI. Usually implemented
     * in AbstractFeedback, but can be overridden to implement fallback logic in case of errors.
     *
     * @param ControllerContext $controllerContext
     * @return array
     */
    public function serialize(ControllerContext $controllerContext);

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
