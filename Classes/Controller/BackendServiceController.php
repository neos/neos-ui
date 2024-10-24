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

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\Feature\WorkspaceModification\Exception\WorkspaceIsNotEmptyException;
use Neos\ContentRepository\Core\Feature\WorkspaceRebase\Dto\RebaseErrorHandlingStrategy;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
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
use Neos\Neos\Domain\Service\WorkspacePublishingService;
use Neos\Neos\Domain\Service\WorkspaceService;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Application\ChangeTargetWorkspace;
use Neos\Neos\Ui\Application\DiscardAllChanges;
use Neos\Neos\Ui\Application\DiscardChangesInDocument;
use Neos\Neos\Ui\Application\DiscardChangesInSite;
use Neos\Neos\Ui\Application\PublishChangesInDocument\PublishChangesInDocumentCommand;
use Neos\Neos\Ui\Application\PublishChangesInDocument\PublishChangesInDocumentCommandHandler;
use Neos\Neos\Ui\Application\PublishChangesInSite\PublishChangesInSiteCommand;
use Neos\Neos\Ui\Application\PublishChangesInSite\PublishChangesInSiteCommandHandler;
use Neos\Neos\Ui\Application\ReloadNodes\ReloadNodesQuery;
use Neos\Neos\Ui\Application\ReloadNodes\ReloadNodesQueryHandler;
use Neos\Neos\Ui\Application\SyncWorkspace\SyncWorkspaceCommand;
use Neos\Neos\Ui\Application\SyncWorkspace\SyncWorkspaceCommandHandler;
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
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * @Flow\Inject
     * @var WorkspacePublishingService
     */
    protected $workspacePublishingService;

    /**
     * @Flow\Inject
     * @var PublishChangesInSiteCommandHandler
     */
    protected $publishChangesInSiteCommandHandler;

    /**
     * @Flow\Inject
     * @var PublishChangesInDocumentCommandHandler
     */
    protected $publishChangesInDocumentCommandHandler;

    /**
     * @Flow\Inject
     * @var SyncWorkspaceCommandHandler
     */
    protected $syncWorkspaceCommandHandler;

    /**
     * @Flow\Inject
     * @var ReloadNodesQueryHandler
     */
    protected $reloadNodesQueryHandler;

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
     * @phpstan-param list<array<string,mixed>> $changes
     */
    public function changeAction(array $changes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;

        $changeCollection = $this->changeCollectionConverter->convert($changes, $contentRepositoryId);
        try {
            $count = $changeCollection->count();
            $changeCollection->apply();

            $success = new Info();
            $success->setMessage(
                $this->getLabel('changesApplied', [$count], $count)
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
     * Publish all changes in the current site
     *
     * @phpstan-param array{workspaceName:string,siteId:string,preferredDimensionSpacePoint?:array<string,string[]>} $command
     */
    public function publishChangesInSiteAction(array $command): void
    {
        try {
            /** @todo send from UI */
            $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
            $command['contentRepositoryId'] = $contentRepositoryId->value;
            $command['siteId'] = NodeAddress::fromJsonString(
                $command['siteId']
            )->aggregateId->value;
            $command = PublishChangesInSiteCommand::fromArray($command);

            $result = $this->publishChangesInSiteCommandHandler
                ->handle($command);

            $this->view->assign('value', $result);
        } catch (\Exception $e) {
            $this->view->assign('value', [
                'error' => [
                    'class' => $e::class,
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ]);
        }
    }

    /**
     * Publish all changes in the current document
     *
     * @phpstan-param array{workspaceName:string,documentId:string,preferredDimensionSpacePoint?:array<string,string[]>} $command
     */
    public function publishChangesInDocumentAction(array $command): void
    {
        try {
            /** @todo send from UI */
            $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
            $command['contentRepositoryId'] = $contentRepositoryId->value;
            $command['documentId'] =  NodeAddress::fromJsonString(
                $command['documentId']
            )->aggregateId->value;
            $command = PublishChangesInDocumentCommand::fromArray($command);

            $result = $this->publishChangesInDocumentCommandHandler
                ->handle($command);

            $this->view->assign('value', $result);
        } catch (\Exception $e) {
            $this->view->assign('value', [
                'error' => [
                    'class' => $e::class,
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ]);
        }
    }

    /**
     * Discard all changes in the user's personal workspace
     *
     * @phpstan-param array<string,string> $command
     */
    public function discardAllChangesAction(array $command): void
    {
        try {
            /** @todo send from UI */
            $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
            $command['contentRepositoryId'] = $contentRepositoryId->value;
            $command = DiscardAllChanges::fromArray($command);

            $discardingResult = $this->workspacePublishingService->discardAllWorkspaceChanges(
                $command->contentRepositoryId,
                $command->workspaceName
            );

            $this->view->assign('value', [
                'success' => [
                    'numberOfAffectedChanges' => $discardingResult->numberOfDiscardedChanges
                ]
            ]);
        } catch (\Exception $e) {
            $this->view->assign('value', [
                'error' => [
                    'class' => $e::class,
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ]);
        }
    }

    /**
     * Discard all changes in the given site
     *
     * @phpstan-param array<string,string> $command
     */
    public function discardChangesInSiteAction(array $command): void
    {
        try {
            /** @todo send from UI */
            $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
            $command['contentRepositoryId'] = $contentRepositoryId->value;
            $command['siteId'] =  NodeAddress::fromJsonString(
                $command['siteId']
            )->aggregateId->value;
            $command = DiscardChangesInSite::fromArray($command);

            $discardingResult = $this->workspacePublishingService->discardChangesInSite(
                $command->contentRepositoryId,
                $command->workspaceName,
                $command->siteId
            );

            $this->view->assign('value', [
                'success' => [
                    'numberOfAffectedChanges' => $discardingResult->numberOfDiscardedChanges
                ]
            ]);
        } catch (\Exception $e) {
            $this->view->assign('value', [
                'error' => [
                    'class' => $e::class,
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ]);
        }
    }

    /**
     * Discard all changes in the given document
     *
     * @phpstan-param array<string,string> $command
     */
    public function discardChangesInDocumentAction(array $command): void
    {
        try {
            /** @todo send from UI */
            $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
            $command['contentRepositoryId'] = $contentRepositoryId->value;
            $command['documentId'] =  NodeAddress::fromJsonString(
                $command['documentId']
            )->aggregateId->value;
            $command = DiscardChangesInDocument::fromArray($command);

            $discardingResult = $this->workspacePublishingService->discardChangesInDocument(
                $command->contentRepositoryId,
                $command->workspaceName,
                $command->documentId
            );

            $this->view->assign('value', [
                'success' => [
                    'numberOfAffectedChanges' => $discardingResult->numberOfDiscardedChanges
                ]
            ]);
        } catch (\Exception $e) {
            $this->view->assign('value', [
                'error' => [
                    'class' => $e::class,
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ]);
        }
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
        $documentNodeAddress = NodeAddress::fromJsonString($documentNode);

        $user = $this->userService->getBackendUser();
        if ($user === null) {
            $error = new Error();
            $error->setMessage('No authenticated account');
            $this->feedbackCollection->add($error);
            $this->view->assign('value', $this->feedbackCollection);
            return;
        }
        $userWorkspace = $this->workspaceService->getPersonalWorkspaceForUser($documentNodeAddress->contentRepositoryId, $user->getId());

        /** @todo send from UI */
        $command = new ChangeTargetWorkspace(
            $documentNodeAddress->contentRepositoryId,
            $userWorkspace->workspaceName,
            WorkspaceName::fromString($targetWorkspaceName),
            $documentNodeAddress
        );

        try {
            $this->workspacePublishingService->changeBaseWorkspace($documentNodeAddress->contentRepositoryId, $userWorkspace->workspaceName, WorkspaceName::fromString($targetWorkspaceName));
        } catch (WorkspaceIsNotEmptyException $exception) {
            $error = new Error();
            $error->setMessage(
                $this->getLabel('workspaceContainsUnpublishedChanges')
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

        $contentRepository = $this->contentRepositoryRegistry->get($documentNodeAddress->contentRepositoryId);
        $subgraph = $contentRepository->getContentGraph($userWorkspace->workspaceName)
            ->getSubgraph(
                $command->documentNode->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );

        $documentNodeInstance = $subgraph->findNodeById($command->documentNode->aggregateId);
        assert($documentNodeInstance !== null);

        $success = new Success();
        $success->setMessage(
            $this->getLabel('switchedBaseWorkspace', ['workspace' => $targetWorkspaceName])
        );
        $this->feedbackCollection->add($success);

        $updateWorkspaceInfo = new UpdateWorkspaceInfo($command->contentRepositoryId, $userWorkspace->workspaceName);
        $this->feedbackCollection->add($updateWorkspaceInfo);

        // If current document node doesn't exist in the base workspace,
        // traverse its parents to find the one that exists
        // todo ensure that https://github.com/neos/neos-ui/pull/3734 doesnt need to be refixed in Neos 9.0
        $redirectNode = $documentNodeInstance;
        while (true) {
            $redirectNodeInBaseWorkspace = $subgraph->findNodeById($redirectNode->aggregateId);
            if ($redirectNodeInBaseWorkspace) {
                break;
            }
            $redirectNode = $subgraph->findParentNode($redirectNode->aggregateId);
            // get parent always returns Node
            if (!$redirectNode) {
                throw new \Exception(
                    sprintf(
                        'Wasn\'t able to locate any valid node in rootline of node %s in the workspace %s.',
                        $documentNodeInstance->aggregateId->value,
                        $targetWorkspaceName
                    ),
                    1458814469
                );
            }
        }

        // If current document node exists in the base workspace, then reload, else redirect
        if ($redirectNode->equals($documentNodeInstance)) {
            $reloadDocument = new ReloadDocument();
            $reloadDocument->setNode($documentNodeInstance);
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
     * @phpstan-param list<string> $nodes
     * @return void
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    public function copyNodesAction(array $nodes): void
    {
        /** @var array<int,NodeAddress> $nodeAddresses */
        $nodeAddresses = array_map(
            NodeAddress::fromJsonString(...),
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
     * @phpstan-param list<string> $nodes
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    public function cutNodesAction(array $nodes): void
    {
        /** @var array<int,NodeAddress> $nodeAddresses */
        $nodeAddresses = array_map(
            NodeAddress::fromJsonString(...),
            $nodes
        );

        $this->clipboard->cutNodes($nodeAddresses);
    }

    public function getWorkspaceInfoAction(): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $personalWorkspaceInfo = (new WorkspaceHelper())->getPersonalWorkspace($contentRepositoryId);
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
     * @phpstan-param list<string> $nodes
     */
    public function getAdditionalNodeMetadataAction(array $nodes): void
    {
        $result = [];
        foreach ($nodes as $nodeAddressString) {
            $nodeAddress = NodeAddress::fromJsonString($nodeAddressString);
            $contentRepository = $this->contentRepositoryRegistry->get($nodeAddress->contentRepositoryId);
            $subgraph = $contentRepository->getContentGraph($nodeAddress->workspaceName)->getSubgraph(
                $nodeAddress->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );
            $node = $subgraph->findNodeById($nodeAddress->aggregateId);

            // TODO finish implementation
            /*$otherNodeVariants = array_values(array_filter(array_map(function ($node) {
                return $this->getCurrentDimensionPresetIdentifiersForNode($node);
            }, $node->getOtherNodeVariants())));*/
            if (!is_null($node)) {
                $result[$nodeAddress->toJson()] = [
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
     * @phpstan-param list<NodeAddress> $nodes
     */
    public function getPolicyInformationAction(array $nodes): void
    {
        $result = [];
        foreach ($nodes as $nodeAddress) {
            $contentRepository = $this->contentRepositoryRegistry->get($nodeAddress->contentRepositoryId);
            $subgraph = $contentRepository->getContentGraph($nodeAddress->workspaceName)->getSubgraph(
                $nodeAddress->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );
            $node = $subgraph->findNodeById($nodeAddress->aggregateId);
            if (!is_null($node)) {
                $result[$nodeAddress->toJson()] = [
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
     * @phpstan-param non-empty-list<array{type: string, payload: array<string|int, mixed>}> $chain
     */
    public function flowQueryAction(array $chain): string
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;

        $createContext = array_shift($chain);
        $finisher = array_pop($chain);

        // we deduplicate passed nodes here
        $nodeContextPaths = array_unique(array_column($createContext['payload'], '$node'));

        $flowQuery = new FlowQuery(
            array_map(
                fn ($nodeContextPath) => $this->nodeService->findNodeBySerializedNodeAddress(
                    $nodeContextPath
                ),
                $nodeContextPaths
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
                $this->request,
                $finisher['payload']['nodeTypeFilter'] ?? null
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
        $contextNodeAddress = NodeAddress::fromJsonString($contextNode);
        $contentRepository = $this->contentRepositoryRegistry->get($contextNodeAddress->contentRepositoryId);
        $subgraph = $contentRepository->getContentGraph($contextNodeAddress->workspaceName)->getSubgraph(
            $contextNodeAddress->dimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
        );
        $contextNode = $subgraph->findNodeById($contextNodeAddress->aggregateId);

        $slug = $this->nodeUriPathSegmentGenerator->generateUriPathSegment($contextNode, $text);
        $this->view->assign('value', $slug);
    }

    /**
     * Rebase user workspace to current workspace
     *
     * @param string $targetWorkspaceName
     * @param bool $force
     * @phpstan-param null|array<mixed> $dimensionSpacePoint
     * @return void
     */
    public function syncWorkspaceAction(string $targetWorkspaceName, bool $force, ?array $dimensionSpacePoint): void
    {
        try {
            $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
            $targetWorkspaceName = WorkspaceName::fromString($targetWorkspaceName);
            $dimensionSpacePoint = $dimensionSpacePoint
                ? DimensionSpacePoint::fromLegacyDimensionArray($dimensionSpacePoint)
                : null;

            /** @todo send from UI */
            $command = new SyncWorkspaceCommand(
                contentRepositoryId: $contentRepositoryId,
                workspaceName: $targetWorkspaceName,
                preferredDimensionSpacePoint: $dimensionSpacePoint,
                rebaseErrorHandlingStrategy: $force
                    ? RebaseErrorHandlingStrategy::STRATEGY_FORCE
                    : RebaseErrorHandlingStrategy::STRATEGY_FAIL
            );

            $result = $this->syncWorkspaceCommandHandler->handle($command);

            $this->view->assign('value', $result);
        } catch (\Exception $e) {
            $this->view->assign('value', [
                'error' => [
                    'class' => $e::class,
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ]);
        }
    }

    /**
     * @phpstan-param array<mixed> $query
     * @return void
     */
    public function reloadNodesAction(array $query): void
    {
        /** @todo send from UI */
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $query['contentRepositoryId'] = $contentRepositoryId->value;
        $query['siteId'] =  NodeAddress::fromJsonString(
            $query['siteId']
        )->aggregateId->value;
        $query['documentId'] =  NodeAddress::fromJsonString(
            $query['documentId']
        )->aggregateId->value;
        $query['ancestorsOfDocumentIds'] = array_map(
            fn (string $nodeAddress) =>
                 NodeAddress::fromJsonString(
                     $nodeAddress
                 )->aggregateId->value,
            $query['ancestorsOfDocumentIds']
        );
        $query['toggledNodesIds'] = array_map(
            fn (string $nodeAddress) =>
                 NodeAddress::fromJsonString(
                     $nodeAddress
                 )->aggregateId->value,
            $query['toggledNodesIds']
        );
        $query['clipboardNodesIds'] = array_map(
            fn (string $nodeAddress) =>
                 NodeAddress::fromJsonString(
                     $nodeAddress
                 )->aggregateId->value,
            $query['clipboardNodesIds']
        );
        $query = ReloadNodesQuery::fromArray($query);


        try {
            $result = $this->reloadNodesQueryHandler->handle($query, $this->request);
            $this->view->assign('value', [
                'success' => $result
            ]);
        } catch (\Exception $e) {
            $this->view->assign('value', [
                'error' => [
                    'class' => $e::class,
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ]);
        }
    }
}
