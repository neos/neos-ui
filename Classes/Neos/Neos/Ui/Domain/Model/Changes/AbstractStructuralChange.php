<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Ui\TYPO3CR\Service\NodeService;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RenderContentOutOfBand;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

/**
 * A change that performs structural actions like moving or creating nodes
 */
abstract class AbstractStructuralChange extends AbstractChange
{
    /**
     * The node dom address for the parent node of the created node
     *
     * @var RenderedNodeDomAddress
     */
    protected $parentDomAddress;

    /**
     * The node dom address for the referenced sibling node of the created node
     *
     * @var RenderedNodeDomAddress
     */
    protected $siblingDomAddress;

    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @var NodeInterface
     */
    protected $cachedParentNode = null;

    /**
     * @var NodeInterface
     */
    protected $cachedSiblingNode = null;

    /**
     * Get the insertion mode (before|after|into) that is represented by this change
     *
     * @return string
     */
    abstract public function getMode();

    /**
     * Set the parent node dom address
     *
     * @param RenderedNodeDomAddress $parentDomAddress
     * @return void
     */
    public function setParentDomAddress(RenderedNodeDomAddress $parentDomAddress = null)
    {
        $this->parentDomAddress = $parentDomAddress;
    }

    /**
     * Get the parent node dom address
     *
     * @return RenderedNodeDomAddress
     */
    public function getParentDomAddress()
    {
        return $this->parentDomAddress;
    }

    /**
     * Get the parent node
     *
     * @return NodeInterface
     */
    public function getParentNode()
    {
        if ($this->parentDomAddress === null) {
            return null;
        }

        if ($this->cachedParentNode === null) {
            $this->cachedParentNode = $this->nodeService->getNodeFromContextPath(
                $this->parentDomAddress->getContextPath()
            );
        }

        return $this->cachedParentNode;
    }

    /**
     * Set the sibling node dom address
     *
     * @param RenderedNodeDomAddress $siblingDomAddress
     * @return void
     */
    public function setSiblingDomAddress(RenderedNodeDomAddress $siblingDomAddress = null)
    {
        $this->siblingDomAddress = $siblingDomAddress;
    }

    /**
     * Get the sibling node dom address
     *
     * @return RenderedNodeDomAddress
     */
    public function getSiblingDomAddress()
    {
        return $this->siblingDomAddress;
    }

    /**
     * Get the sibling node
     *
     * @return NodeInterface
     */
    public function getSiblingNode()
    {
        if ($this->siblingDomAddress === null) {
            return null;
        }

        if ($this->cachedSiblingNode === null) {
            $this->cachedSiblingNode = $this->nodeService->getNodeFromContextPath(
                $this->siblingDomAddress->getContextPath()
            );
        }

        return $this->cachedSiblingNode;
    }

    /**
     * Perform finish tasks - needs to be called from inheriting clas on `apply`
     *
     * @param NodeInterface $node
     * @return void
     */
    protected function finish(NodeInterface $node)
    {
        $this->persistenceManager->persistAll();

        $updateNodeInfo = new UpdateNodeInfo();
        $updateNodeInfo->setNode($node);

        $updateParentNodeInfo = new UpdateNodeInfo();
        $updateParentNodeInfo->setNode($node->getParent());

        $this->feedbackCollection->add($updateNodeInfo);
        $this->feedbackCollection->add($updateParentNodeInfo);

        if ($node->getNodeType()->isOfType('Neos.Neos:Content') && ($this->getParentDomAddress() || $this->getSiblingDomAddress())) {
            if ($node->getParent()->getNodeType()->isOfType('Neos.Neos:ContentCollection')) {
                $renderContentOutOfBand = new RenderContentOutOfBand();
                $renderContentOutOfBand->setNode($node);
                $renderContentOutOfBand->setParentDomAddress($this->getParentDomAddress());
                $renderContentOutOfBand->setSiblingDomAddress($this->getSiblingDomAddress());
                $renderContentOutOfBand->setMode($this->getMode());

                $this->feedbackCollection->add($renderContentOutOfBand);
            } else {
                $reloadDocument = new ReloadDocument();

                $this->feedbackCollection->add($reloadDocument);
            }
        }
    }
}
