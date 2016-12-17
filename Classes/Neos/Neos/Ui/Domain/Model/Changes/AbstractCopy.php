<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Service\NodeServiceInterface;
use Neos\Neos\Ui\Domain\Model\AbstractReferencingChange;
use Neos\Neos\Ui\Domain\Model\ChangeInterface;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;
use Neos\ContentRepository\Domain\Model\NodeInterface;

abstract class AbstractCopy extends AbstractReferencingChange
{
    /**
     * @Flow\Inject
     * @var NodeServiceInterface
     */
    protected $nodeService;

    /**
     * Checks whether this change can be merged with a subsequent change
     *
     * @param  ChangeInterface $subsequentChange
     * @return boolean
     */
    public function canMerge(ChangeInterface $subsequentChange)
    {
        if (!$subsequentChange instanceof AbstractCopy) {
            return false;
        }

        if ($subsequentChange->getSubject() !== $this->getSubject()) {
            return false;
        }

        return $subsequentChange->canApply();
    }

    /**
     * Merges this change with a subsequent change
     *
     * @param  ChangeInterface $subsequentChange
     * @return void
     */
    public function merge(ChangeInterface $subsequentChange)
    {
        if ($this->canMerge($subsequentChange)) {
            return $subsequentChange;
        }
    }

    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply()
    {
        $referenceNode = $this->getReference();
        $referenceNodeParent = $referenceNode->getParent();
        $nodeType = $this->getSubject()->getNodeType();

        return $referenceNode->isNodeTypeAllowedAsChildNode($nodeType);
    }

    /**
     * Generate a unique node name for the copied node
     *
     * @param NodeInterface $parentNode
     * @return string
     */
    protected function generateUniqueNodeName(NodeInterface $parentNode)
    {
        return $this->nodeService->generateUniqueNodeName($parentNode->getPath(), $this->getSubject()->getName());
    }

    /**
     * Prepare feedback
     *
     * @param NodeInterface $newNode
     * @return void
     */
    protected function finish(NodeInterface $newNode)
    {
        $this->updateWorkspaceInfo();

        $updateNodeInfo = new UpdateNodeInfo();
        $updateNodeInfo->setNode($newNode);

        $updateParentNodeInfo = new UpdateNodeInfo();
        $updateParentNodeInfo->setNode($newNode->getParent());

        $this->feedbackCollection->add($updateNodeInfo);
        $this->feedbackCollection->add($updateParentNodeInfo);
    }
}
