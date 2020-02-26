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

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;

/**
 * @Flow\Scope("singleton")
 */
class FeedbackCollection implements \JsonSerializable
{
    /**
     * @var array<FeedbackInterface>
     */
    protected $feedbacks = [];

    /**
     * @var ControllerContext
     */
    protected $controllerContext;

    /**
     * Set the controller context
     *
     * @param ControllerContext $controllerContext
     * @return void
     */
    public function setControllerContext(ControllerContext $controllerContext)
    {
        $this->controllerContext = $controllerContext;
    }

    /**
     * Add feedback
     *
     * @param FeedbackInterface $feedback
     * @return void
     */
    public function add(FeedbackInterface $feedback)
    {
        foreach ($this->feedbacks as $value) {
            if ($value->isSimilarTo($feedback)) {
                return;
            }
        }

        $this->feedbacks[] = $feedback;
    }

    /**
     * Serialize collection to `json_encode`able array
     *
     * @return array
     */
    public function jsonSerialize()
    {
        $feedbacks = [];

        foreach ($this->feedbacks as $feedback) {
            $feedbacks[] = $feedback->serialize($this->controllerContext);
        }

        return [
            'timestamp' => new \DateTime(),
            'feedbacks' => $feedbacks
        ];
    }

    public function reset()
    {
        $this->feedbacks = [];
    }
}
