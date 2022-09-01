<?php
namespace Neos\Neos\Ui\Domain\Model;

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
use Neos\ContentRepository\Core\SharedModel\User\UserId;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\Model\User;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\NodeCreated;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;

abstract class AbstractChange implements ChangeInterface
{
    protected ?Node $subject;

    /**
     * @Flow\Inject
     * @var FeedbackCollection
     */
    protected $feedbackCollection;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    public function setSubject(Node $subject): void
    {
        $this->subject = $subject;
    }

    public function getSubject(): ?Node
    {
        return $this->subject;
    }

    /**
     * Helper method to inform the client, that new workspace information is available
     */
    protected function updateWorkspaceInfo(): void
    {
        if (!is_null($this->subject)) {
            $documentNode = $this->findClosestDocumentNode($this->subject);
            if (!is_null($documentNode)) {
                $contentRepository = $this->contentRepositoryRegistry->get($this->subject->subgraphIdentity->contentRepositoryId);
                $workspace = $contentRepository->getWorkspaceFinder()->findOneByCurrentContentStreamId(
                    $documentNode->subgraphIdentity->contentStreamId
                );
                if (!is_null($workspace)) {
                    $updateWorkspaceInfo = new UpdateWorkspaceInfo
                    ($documentNode->subgraphIdentity->contentRepositoryId, $workspace->workspaceName);
                    $this->feedbackCollection->add($updateWorkspaceInfo);
                }
            }
        }
    }

    final protected function findClosestDocumentNode(Node $node): ?Node
    {
        while ($node instanceof Node) {
            if ($node->nodeType->isOfType('Neos.Neos:Document')) {
                return $node;
            }
            $node = $this->findParentNode($node);
        }

        return null;
    }

    protected function findParentNode(Node $node): ?Node
    {
        return $this->contentRepositoryRegistry->subgraphForNode($node)
            ->findParentNode($node->nodeAggregateId);
    }

    /**
     * Inform the client to reload the currently-displayed document, because the rendering has changed.
     *
     * This method will be triggered if [nodeType].properties.[propertyName].ui.reloadIfChanged is TRUE.
     */
    protected function reloadDocument(Node $node = null): void
    {
        $reloadDocument = new ReloadDocument();
        if ($node) {
            $reloadDocument->setNode($node);
        }

        $this->feedbackCollection->add($reloadDocument);
    }

    /**
     * Inform the client that a node has been created, the client decides if and which tree should react to this change.
     */
    protected function addNodeCreatedFeedback(Node $subject = null): void
    {
        $node = $subject ?: $this->getSubject();
        if ($node) {
            $nodeCreated = new NodeCreated();
            $nodeCreated->setNode($node);
            $this->feedbackCollection->add($nodeCreated);
        }
    }

    final protected function getInitiatingUserIdentifier(): UserId
    {
        /** @var User $user */
        $user = $this->userService->getBackendUser();

        return UserId::fromString($this->persistenceManager->getIdentifierByObject($user));
    }
}
