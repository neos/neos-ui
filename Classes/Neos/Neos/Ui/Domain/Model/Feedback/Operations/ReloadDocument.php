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

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Service\LinkingService;

class ReloadDocument extends AbstractFeedback
{
    /**
     * @var NodeInterface
     */
    protected $node;

    /**
     * @Flow\Inject
     * @var LinkingService
     */
    protected $linkingService;

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'Neos.Neos.Ui:ReloadDocument';
    }

    /**
     * Set the node
     *
     * @param NodeInterface $node
     * @return void
     */
    public function setNode(NodeInterface $node)
    {
        $this->node = $node;
    }

    /**
     * Get the node
     *
     * @return NodeInterface
     */
    public function getNode()
    {
        return $this->node;
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('Reload of current document required.');
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof ReloadDocument) {
            return false;
        }

        return true;
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        if ($this->node) {
            return [
                'uri' => $this->linkingService->createNodeUri($controllerContext, $this->node, null, null, true, array(), '', false, array(), false)
            ];
        }
        return [];
    }
}
