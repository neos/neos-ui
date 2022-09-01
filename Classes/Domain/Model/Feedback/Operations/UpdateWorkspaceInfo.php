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

use Neos\ContentRepository\Core\Projection\Workspace\Workspace;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Flow\Mvc\Controller\ControllerContext;

class UpdateWorkspaceInfo extends AbstractFeedback
{
    protected ?WorkspaceName $workspaceName;

    /**
     * @Flow\Inject
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * UpdateWorkspaceInfo constructor.
     *
     * @param WorkspaceName $workspaceName
     */
    public function __construct(
        private readonly ContentRepositoryId $contentRepositoryId,
        WorkspaceName $workspaceName = null
    ) {
        $this->workspaceName = $workspaceName;
    }

    /**
     * Set the workspace
     *
     * @param Workspace $workspace
     * @return void
     * @deprecated
     */
    public function setWorkspace(Workspace $workspace)
    {
        $this->workspaceName = $workspace->workspaceName;
    }

    /**
     * Getter for WorkspaceName
     */
    public function getWorkspaceName(): ?WorkspaceName
    {
        return $this->workspaceName;
    }

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'Neos.Neos.Ui:UpdateWorkspaceInfo';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription(): string
    {
        return sprintf('New workspace info available.');
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof UpdateWorkspaceInfo) {
            return false;
        }

        return (string)$this->getWorkspaceName() === (string)$feedback->getWorkspaceName();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        if (!$this->workspaceName) {
            return null;
        }

        $contentRepository = $this->contentRepositoryRegistry->get($this->contentRepositoryId);
        $workspace = $contentRepository->getWorkspaceFinder()->findOneByName($this->workspaceName);

        return $workspace ? [
            'name' => (string)$this->workspaceName,
            'publishableNodes' => $this->workspaceService->getPublishableNodeInfo(
                $this->workspaceName,
                $this->contentRepositoryId
            ),
            'baseWorkspace' => (string)$workspace->baseWorkspaceName
        ] : [];
    }
}
