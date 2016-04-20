<?php
namespace PackageFactory\Guevara\TYPO3CR\Service;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\Workspace;
use TYPO3\Neos\Service\PublishingService;
use TYPO3\Eel\FlowQuery\FlowQuery;

/**
 * @Flow\Scope("singleton")
 */
class WorkspaceService
{
    /**
     * @Flow\Inject
     * @var PublishingService
     */
    protected $publishingService;

    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * Get all publishable node context paths for a workspace
     *
     * @param Workspace $workspace
     * @return array
     */
    public function getPublishableNodeInfo(Workspace $workspace)
    {
        $publishableNodes = $this->publishingService->getUnpublishedNodes($workspace);

        $publishableNodes = array_map(function ($node) {
            $documentNode = $this->nodeService->getClosestDocument($node);

            return [
                'contextPath' => $node->getContextPath(),
                'documentContextPath' => $documentNode->getContextPath()
            ];
        }, $publishableNodes);

        return $publishableNodes;
    }
}
