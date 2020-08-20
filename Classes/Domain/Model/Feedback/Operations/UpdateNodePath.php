<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

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
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;

class UpdateNodePath extends AbstractFeedback
{

    /**
     * @var string
     */
    protected $oldContextPath;

    /**
     * @var string
     */
    protected $newContextPath;

    /**
     * Set the original context path before a node was moved
     *
     * @param string $contextPath
     * @return void
     */
    public function setOldContextPath(string $contextPath): void
    {
        $this->oldContextPath = $contextPath;
    }

    /**
     * Set the new context path after a node was moved
     *
     * @param string $contextPath
     * @return void
     */
    public function setNewContextPath(string $contextPath): void
    {
        $this->newContextPath = $contextPath;
    }

    /**
     * Get the original context path of the moved node
     *
     * @return string
     */
    public function getOldContextPath(): string
    {
        return $this->oldContextPath;
    }

    /**
     * Get the new context path of the moved node
     *
     * @return string
     */
    public function getNewContextPath(): string
    {
        return $this->newContextPath;
    }

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'Neos.Neos.Ui:UpdateNodePath';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('Updated path for node context path "%s" is available.', $this->getOldContextPath());
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof self) {
            return false;
        }

        return $this->getOldContextPath() === $feedback->getOldContextPath();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        return [
            'oldContextPath' => $this->getOldContextPath(),
            'newContextPath' => $this->getNewContextPath(),
        ];
    }
}
