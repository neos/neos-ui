<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\Controller;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\Feature\WorkspaceModification\Exception\WorkspaceIsNotEmptyException;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregateCurrentlyDoesNotExist;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\GetOperation;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\View\JsonView;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Service\WorkspaceNameBuilder;
use Neos\Neos\Domain\Workspace\WorkspaceFactory;
use Neos\Neos\FrontendRouting\NodeAddress;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Application\ChangeTargetWorkspace;
use Neos\Neos\Ui\Application\DiscardChangesInDocument;
use Neos\Neos\Ui\Application\DiscardChangesInSite;
use Neos\Neos\Ui\Application\PublishChangesInDocument;
use Neos\Neos\Ui\Application\PublishChangesInSite;
use Neos\Neos\Ui\Application\SyncWorkspace;
use Neos\Neos\Ui\ContentRepository\Service\NeosUiNodeService;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Error;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Info;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Success;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\Redirect;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;
use Neos\Neos\Ui\Domain\Model\FeedbackCollection;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;
use Neos\Neos\Ui\Fusion\Helper\WorkspaceHelper;
use Neos\Neos\Ui\Service\NodeClipboard;
use Neos\Neos\Ui\TypeConverter\ChangeCollectionConverter;
use Neos\Neos\Utility\NodeUriPathSegmentGenerator;

/**
 * @internal
 */
class BackendServiceController extends ActionController
{
    use TranslationTrait;

    /**
     * @var array<int,string>
     */
    protected $supportedMediaTypes = ['application/json'];

    /**
     * @var string
     */
    protected $defaultViewObjectName = JsonView::class;

    /**
     * @Flow\Inject
     * @var FeedbackCollection
     */
    protected $feedbackCollection;

    /**
     * @Flow\Inject
     * @var NeosUiNodeService
     */
    protected $nodeService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var ChangeCollectionConverter
     */
    protected $changeCollectionConverter;

    /**
     * @Flow\Inject
     * @var NodeClipboard
     */
    protected $clipboard;

    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * @Flow\Inject
     * @var Context
     */
    protected $securityContext;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * @Flow\Inject
     * @var NodeUriPathSegmentGenerator
     */
    protected $nodeUriPathSegmentGenerator;

    /**
     * @Flow\Inject
     * @var WorkspaceFactory
     */
    protected $workspaceFactory;

    /**
     * Set the controller context on the feedback collection after the controller
     * has been initialized
     */
    protected function initializeController(ActionRequest $request, ActionResponse $response): void
    {
        parent::initializeController($request, $response);
        $this->feedbackCollection->setControllerContext($this->getControllerContext());
    }

    /**
     * Apply a set of changes to the system
     * @psalm-param list<array<string,mixed>> $changes
     */
    public function changeAction(array $changes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;

        $changes = $this->changeCollectionConverter->convert($changes, $contentRepositoryId);
        try {
            $count = $changes->count();
            $changes->apply();

            $success = new Info();
            $success->setMessage(sprintf('%d change(s) successfully applied.', $count));

            $this->feedbackCollection->add($success);
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }

    /**
     * Publish all changes in the current site
     *
     * @phpstan-param array<string,string> $command
     */
    public function publishChangesInSiteAction(array $command): void
    {
        /** @todo send from UI */
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $command['contentRepositoryId'] = $contentRepositoryId->value;
        $command['siteId'] = $this->nodeService->deserializeNodeAddress(
            $command['siteId'],
            $contentRepositoryId
        )->nodeAggregateId->value;
        $command = PublishChangesInSite::fromArray($command);

        try {
            $workspace = $this->workspaceFactory->create(
                $command->contentRepositoryId,
                $command->workspaceName
            );
            $workspace->publishChangesInSite($command->siteId);

            $success = new Success();
            $success->setMessage(sprintf('Published.'));

            $this->feedbackCollection->add($success);
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }
        $this->view->assign('value', $this->feedbackCollection);
    }

    /**
     * Publish all changes in the current document
     *
     * @phpstan-param array<string,string> $command
     */
    public function publishChangesInDocumentAction(array $command): void
    {
        /** @todo send from UI */
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $command['contentRepositoryId'] = $contentRepositoryId->value;
        $command['documentId'] = $this->nodeService->deserializeNodeAddress(
            $command['documentId'],
            $contentRepositoryId
        )->nodeAggregateId->value;
        $command = PublishChangesInDocument::fromArray($command);

        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $baseWorkspaceName = $contentRepository->getWorkspaceFinder()->findOneByName(
            $command->workspaceName
        )->baseWorkspaceName;

        try {
            try {
                $workspace = $this->workspaceFactory->create(
                    $command->contentRepositoryId,
                    $command->workspaceName
                );
                $numberOfChanges = $workspace->publishChangesInDocument($command->documentId);
            } catch (NodeAggregateCurrentlyDoesNotExist $e) {
                throw new NodeAggregateCurrentlyDoesNotExist(
                    'Node could not be published, probably because of a missing parentNode. Please check that the parentNode has been published.',
                    1682762156
                );
            }

            $success = new Success();
            $success->setMessage(
                sprintf(
                    'Published %d change(s) to %s.',
                    $numberOfChanges,
                    $baseWorkspaceName->value
                )
            );

            $this->feedbackCollection->add($success);
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }

    /**
     * Discard all changes in the given site
     *
     * @phpstan-param array<string,string> $command
     */
    public function discardChangesInSiteAction(array $command): void
    {
        /** @todo send from UI */
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $command['contentRepositoryId'] = $contentRepositoryId->value;
        $command['siteId'] = $this->nodeService->deserializeNodeAddress(
            $command['siteId'],
            $contentRepositoryId
        )->nodeAggregateId->value;
        $command = DiscardChangesInSite::fromArray($command);

        try {
            $workspace = $this->workspaceFactory->create(
                $command->contentRepositoryId,
                $command->workspaceName
            );
            $numberOfDiscardedChanges = $workspace->discardChangesInSite($command->siteId);

            $success = new Success();
            $success->setMessage(sprintf('Discarded %d change(s).', $numberOfDiscardedChanges));

            $this->feedbackCollection->add($success);
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }

    /**
     * Discard all changes in the given document
     *
     * @phpstan-param array<string,string> $command
     */
    public function discardChangesInDocumentAction(array $command): void
    {
        /** @todo send from UI */
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $command['contentRepositoryId'] = $contentRepositoryId->value;
        $command['documentId'] = $this->nodeService->deserializeNodeAddress(
            $command['documentId'],
            $contentRepositoryId
        )->nodeAggregateId->value;
        $command = DiscardChangesInDocument::fromArray($command);

        try {
            $workspace = $this->workspaceFactory->create(
                $command->contentRepositoryId,
                $command->workspaceName
            );
            $numberOfDiscardedChanges = $workspace->discardChangesInDocument($command->documentId);

            $success = new Success();
            $success->setMessage(sprintf('Discarded %d change(s).', $numberOfDiscardedChanges));

            $this->feedbackCollection->add($success);
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }

    /**
     * Change base workspace of current user workspace
     *
     * @param string $targetWorkspaceName ,
     * @param string $documentNode
     * @return void
     * @throws \Exception
     */
    public function changeBaseWorkspaceAction(string $targetWorkspaceName, string $documentNode): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);

        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        $currentAccount = $this->securityContext->getAccount();
        $userWorkspaceName = WorkspaceNameBuilder::fromAccountIdentifier(
            $currentAccount->getAccountIdentifier()
        );

        /** @todo send from UI */
        $command = new ChangeTargetWorkspace(
            $contentRepositoryId,
            $userWorkspaceName,
            WorkspaceName::fromString($targetWorkspaceName),
            $nodeAddressFactory->createFromUriString($documentNode)
        );

        try {
            $workspace = $this->workspaceFactory->create(
                $command->contentRepositoryId,
                $command->workspaceName
            );
            $workspace->changeBaseWorkspace($command->targetWorkspaceName);
        } catch (WorkspaceIsNotEmptyException $exception) {
            $error = new Error();
            $error->setMessage(
                'Your personal workspace currently contains unpublished changes.'
                . ' In order to switch to a different target workspace you need to either publish'
                . ' or discard pending changes first.'
            );

            $this->feedbackCollection->add($error);
            $this->view->assign('value', $this->feedbackCollection);
            return;
        } catch (\Exception $exception) {
            $error = new Error();
            $error->setMessage($error->getMessage());

            $this->feedbackCollection->add($error);
            $this->view->assign('value', $this->feedbackCollection);
            return;
        }

        $subgraph = $contentRepository->getContentGraph()
            ->getSubgraph(
                $workspace->getCurrentContentStreamId(),
                $command->documentNode->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );

        $documentNode = $subgraph->findNodeById($command->documentNode->nodeAggregateId);

        $success = new Success();
        $success->setMessage(sprintf('Switched base workspace to %s.', $targetWorkspaceName));
        $this->feedbackCollection->add($success);

        $updateWorkspaceInfo = new UpdateWorkspaceInfo($contentRepositoryId, $userWorkspaceName);
        $this->feedbackCollection->add($updateWorkspaceInfo);

        // If current document node doesn't exist in the base workspace,
        // traverse its parents to find the one that exists
        $redirectNode = $documentNode;
        while (true) {
            $redirectNodeInBaseWorkspace = $subgraph->findNodeById($redirectNode->nodeAggregateId);
            if ($redirectNodeInBaseWorkspace) {
                break;
            } else {
                $redirectNode = $subgraph->findParentNode($redirectNode->nodeAggregateId);
                // get parent always returns Node
                if (!$redirectNode) {
                    throw new \Exception(
                        sprintf(
                            'Wasn\'t able to locate any valid node in rootline of node %s in the workspace %s.',
                            $documentNode->nodeAggregateId->value,
                            $targetWorkspaceName
                        ), 1458814469
                    );
                }
            }
        }

        // If current document node exists in the base workspace, then reload, else redirect
        if ($redirectNode->equals($documentNode)) {
            $reloadDocument = new ReloadDocument();
            $reloadDocument->setNode($documentNode);
            $this->feedbackCollection->add($reloadDocument);
        } else {
            $redirect = new Redirect();
            $redirect->setNode($redirectNode);
            $this->feedbackCollection->add($redirect);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }


    /**
     * Persists the clipboard node on copy
     *
     * @psalm-param list<string> $nodes
     * @return void
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    public function copyNodesAction(array $nodes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        /** @var array<int,NodeAddress> $nodeAddresses */
        $nodeAddresses = array_map(
            fn(string $serializedNodeAddress) => $nodeAddressFactory->createFromUriString($serializedNodeAddress),
            $nodes
        );
        $this->clipboard->copyNodes($nodeAddresses);
    }

    /**
     * Clears the clipboard state
     *
     * @return void
     */
    public function clearClipboardAction()
    {
        $this->clipboard->clear();
    }

    /**
     * Persists the clipboard node on cut
     *
     * @psalm-param list<string> $nodes
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    public function cutNodesAction(array $nodes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        /** @var array<int,\Neos\Neos\FrontendRouting\NodeAddress> $nodeAddresses */
        $nodeAddresses = array_map(
            fn(string $serializedNodeAddress) => $nodeAddressFactory->createFromUriString($serializedNodeAddress),
            $nodes
        );

        $this->clipboard->cutNodes($nodeAddresses);
    }

    public function getWorkspaceInfoAction(): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $workspaceHelper = new WorkspaceHelper();
        $personalWorkspaceInfo = $workspaceHelper->getPersonalWorkspace($contentRepositoryId);
        $this->view->assign('value', $personalWorkspaceInfo);
    }

    /**
     * @throws \Neos\Flow\Mvc\Exception\NoSuchArgumentException
     */
    public function initializeGetAdditionalNodeMetadataAction(): void
    {
        $this->arguments->getArgument('nodes')
            ->getPropertyMappingConfiguration()->allowAllProperties();
    }

    /**
     * Fetches all the node information that can be lazy-loaded
     * @psalm-param list<string> $nodes
     */
    public function getAdditionalNodeMetadataAction(array $nodes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        $result = [];
        foreach ($nodes as $nodeAddressString) {
            $nodeAddress = $nodeAddressFactory->createFromUriString($nodeAddressString);
            $subgraph = $contentRepository->getContentGraph()->getSubgraph(
                $nodeAddress->contentStreamId,
                $nodeAddress->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );
            $node = $subgraph->findNodeById($nodeAddress->nodeAggregateId);

            // TODO finish implementation
            /*$otherNodeVariants = array_values(array_filter(array_map(function ($node) {
                return $this->getCurrentDimensionPresetIdentifiersForNode($node);
            }, $node->getOtherNodeVariants())));*/
            if (!is_null($node)) {
                $result[$nodeAddress->serializeForUri()] = [
                    // todo reimplement nodePolicyService
                    'policy' => [
                        'disallowedNodeTypes' => [],
                        'canRemove' => true,
                        'canEdit' => true,
                        'disallowedProperties' => []
                    ]
                    //'dimensions' => $this->getCurrentDimensionPresetIdentifiersForNode($node),
                    //'otherNodeVariants' => $otherNodeVariants
                ];
            }
        }

        $this->view->assign('value', $result);
    }

    /**
     * @throws \Neos\Flow\Mvc\Exception\NoSuchArgumentException
     */
    public function initializeGetPolicyInformationAction(): void
    {
        $this->arguments->getArgument('nodes')->getPropertyMappingConfiguration()->allowAllProperties();
    }

    /**
     * @psalm-param list<NodeAddress> $nodes
     */
    public function getPolicyInformationAction(array $nodes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);

        $result = [];
        foreach ($nodes as $nodeAddress) {
            $subgraph = $contentRepository->getContentGraph()->getSubgraph(
                $nodeAddress->contentStreamId,
                $nodeAddress->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );
            $node = $subgraph->findNodeById($nodeAddress->nodeAggregateId);
            if (!is_null($node)) {
                $result[$nodeAddress->serializeForUri()] = [
                    // todo reimplement nodePolicyService
                    'policy' => [
                        'disallowedNodeTypes' => [],
                        'canRemove' => true,
                        'canEdit' => true,
                        'disallowedProperties' => []
                    ]
                ];
            }
        }

        $this->view->assign('value', $result);
    }

    /**
     * Build and execute a flow query chain
     *
     * @psalm-param list<array{type: string, payload: array<string|int, mixed>}> $chain
     */
    public function flowQueryAction(array $chain): string
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;

        $createContext = array_shift($chain);
        $finisher = array_pop($chain);

        $payload = $createContext['payload'] ?? [];
        $flowQuery = new FlowQuery(
            array_map(
                fn($envelope) => $this->nodeService->findNodeBySerializedNodeAddress(
                    $envelope['$node'],
                    $contentRepositoryId
                ),
                $payload
            )
        );

        foreach ($chain as $operation) {
            $flowQuery = $flowQuery->__call($operation['type'], $operation['payload']);
        }

        /** @see GetOperation */
        assert(is_object($flowQuery) && is_callable([$flowQuery, 'get']));

        $nodeInfoHelper = new NodeInfoHelper();
        $type = $finisher['type'] ?? null;
        $result = match ($type) {
            'get' => $nodeInfoHelper->renderNodes(array_filter($flowQuery->get()), $this->request),
            'getForTree' => $nodeInfoHelper->renderNodes(
                array_filter($flowQuery->get()),
                $this->request,
                true
            ),
            'getForTreeWithParents' => $nodeInfoHelper->renderNodesWithParents(
                array_filter($flowQuery->get()),
                $this->request
            ),
            default => []
        };

        return json_encode($result, JSON_THROW_ON_ERROR);
    }

    /**
     * Generates a new uri path segment for the given node and title
     *
     * @throws \Neos\Neos\Exception
     */
    public function generateUriPathSegmentAction(string $contextNode, string $text): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        $contextNodeAddress = $nodeAddressFactory->createFromUriString($contextNode);
        $subgraph = $contentRepository->getContentGraph()->getSubgraph(
            $contextNodeAddress->contentStreamId,
            $contextNodeAddress->dimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
        );
        $contextNode = $subgraph->findNodeById($contextNodeAddress->nodeAggregateId);

        $slug = $this->nodeUriPathSegmentGenerator->generateUriPathSegment($contextNode, $text);
        $this->view->assign('value', $slug);
    }

    /**
     * Rebase user workspace to current workspace
     *
     * @param string $targetWorkspaceName
     * @return void
     */
    public function rebaseWorkspaceAction(string $targetWorkspaceName): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $targetWorkspaceName = WorkspaceName::fromString($targetWorkspaceName);

        /** @todo send from UI */
        $command = new SyncWorkspace(
            contentRepositoryId: $contentRepositoryId,
            workspaceName: $targetWorkspaceName,
            force: false
        );

        try {
            $workspace = $this->workspaceFactory->create(
                $command->contentRepositoryId,
                $command->workspaceName
            );
            $workspace->rebase($command->force);
        } catch (\Exception $exception) {
            $error = new Error();
            $error->setMessage($exception->getMessage());

            $this->feedbackCollection->add($error);
            $this->view->assign('value', $this->feedbackCollection);
            return;
        }

        $success = new Success();
        $success->setMessage(
            $this->getLabel('workspaceSynchronizationApplied', ['workspaceName' => $targetWorkspaceName->value])
        );
        $this->feedbackCollection->add($success);

        $this->view->assign('value', $this->feedbackCollection);
    }
}
