<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Service as ContentRepository;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Ui\Domain\Model\ChangeInterface;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

abstract class AbstractCopy extends AbstractStructuralChange
{
    /**
     * @Flow\Inject
     * @var ContentRepository\NodeServiceInterface
     */
    protected $contentRepositoryNodeService;

    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply()
    {
        $nodeType = $this->getSubject()->getNodeType();

        return $this->getParentNode()->isNodeTypeAllowedAsChildNode($nodeType);
    }

    /**
     * Generate a unique node name for the copied node
     *
     * @param NodeInterface $parentNode
     * @return string
     */
    protected function generateUniqueNodeName(NodeInterface $parentNode)
    {
        return $this->contentRepositoryNodeService
            ->generateUniqueNodeName($parentNode->getPath(), $this->getSubject()->getName());
    }
}
