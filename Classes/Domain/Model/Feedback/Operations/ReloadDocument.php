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

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Ui\ContentRepository\Service\NodeService;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;

class ReloadDocument extends AbstractFeedback
{
    protected ?Node $node;

    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    public function getType(): string
    {
        return 'Neos.Neos.Ui:ReloadDocument';
    }

    public function setNode(Node $node): void
    {
        $this->node = $node;
    }

    public function getNode(): ?Node
    {
        return $this->node;
    }

    public function getDescription(): string
    {
        return sprintf('Reload of current document required.');
    }

    /**
     * Checks whether this feedback is similar to another
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
     * @return array<string,string>
     */
    public function serializePayload(ControllerContext $controllerContext): array
    {
        if (!$this->node) {
            return [];
        }
        $nodeInfoHelper = new NodeInfoHelper();

        if ($documentNode = $this->nodeService->getClosestDocument($this->node)) {
            return [
                'uri' => $nodeInfoHelper->previewUri($documentNode, $controllerContext)
            ];
        }

        return [];
    }
}
