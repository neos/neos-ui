<?php
namespace Neos\Neos\Ui\Domain\Model;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;
use Neos\Neos\Ui\TYPO3CR\Service\NodeService;

abstract class AbstractReferencingChange extends AbstractChange implements ReferencingChangeInterface
{
    /**
     * The reference
     *
     * @var NodeInterface
     */
    protected $reference;

    /**
     * Set the reference
     *
     * @param NodeInterface $reference
     * @return void
     */
    public function setReference(NodeInterface $reference)
    {
        $this->reference = $reference;
    }

    /**
     * Get the reference
     *
     * @return NodeInterface
     */
    public function getReference()
    {
        return $this->reference;
    }

    /**
     * Helper method to inform the client, that new workspace information is available
     *
     * @return void
     */
    protected function updateWorkspaceInfo()
    {
        parent::updateWorkspaceInfo();

        $nodeService = new NodeService();
        $updateWorkspaceInfo = new UpdateWorkspaceInfo();
        $updateWorkspaceInfo->setDocument(
            $nodeService->getClosestDocument($this->getReference())
        );

        $this->feedbackCollection->add($updateWorkspaceInfo);
    }
}
