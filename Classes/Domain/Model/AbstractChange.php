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

use Neos\ContentRepository\Projection\ContentGraph\Node;
use Neos\ContentRepository\SharedModel\User\UserIdentifier;
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
                $contentRepository = $this->contentRepositoryRegistry->get($this->subject->getSubgraphIdentity()->contentRepositoryIdentifier);
                $workspace = $contentRepository->getWorkspaceFinder()->findOneByCurrentContentStreamIdentifier(
                    $documentNode->getSubgraphIdentity()->contentStreamIdentifier
                );
                if (!is_null($workspace)) {
                    $updateWorkspaceInfo = new UpdateWorkspaceInfo($documentNode->getSubgraphIdentity()->contentRepositoryIdentifier, $workspace->getWorkspaceName());
                    $this->feedbackCollection->add($updateWorkspaceInfo);
                }
            }
        }
    }

    final protected function findClosestDocumentNode(Node $node): ?Node
    {
        while ($node instanceof Node) {
            if ($node->getNodeType()->isOfType('Neos.Neos:Document')) {
                return $node;
            }
            $node = $this->findParentNode($node);
        }

        return null;
    }

    protected function findParentNode(Node $node): ?Node
    {
        return $this->contentRepositoryRegistry->subgraphForNode($node)
            ->findParentNode($node->nodeAggregateIdentifier);
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

    final protected function getInitiatingUserIdentifier(): UserIdentifier
    {
        /** @var User $user */
        $user = $this->userService->getBackendUser();

        return UserIdentifier::fromString($this->persistenceManager->getIdentifierByObject($user));
    }
}
