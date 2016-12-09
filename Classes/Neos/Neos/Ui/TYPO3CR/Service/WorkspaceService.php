<?php
namespace Neos\Neos\Ui\TYPO3CR\Service;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\Neos\Service\PublishingService;
use Neos\Eel\FlowQuery\FlowQuery;

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

            if ($documentNode = $this->nodeService->getClosestDocument($node)) {
                return [
                    'contextPath' => $node->getContextPath(),
                    'documentContextPath' => $documentNode->getContextPath()
                ];
            }
        }, $publishableNodes);

        return array_filter($publishableNodes, function ($item) {
            return (bool)$item;
        });
    }
}
