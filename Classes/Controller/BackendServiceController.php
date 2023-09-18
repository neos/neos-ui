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

use Neos\ContentRepository\Core\Feature\WorkspacePublication\Command\DiscardIndividualNodesFromWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Command\PublishIndividualNodesFromWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Dto\NodeIdsToPublishOrDiscard;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Dto\NodeIdToPublishOrDiscard;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregateCurrentlyDoesNotExist;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\View\JsonView;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Model\NeosWorkspaceName;
use Neos\Neos\FrontendRouting\NodeAddress;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\ContentRepository\Service\NodeService;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;
use Neos\Neos\Ui\Domain\Model\ChangeCollection;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Error;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Info;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Success;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;
use Neos\Neos\Ui\Domain\Model\FeedbackCollection;
use Neos\Neos\Ui\Domain\Service\NodeTreeBuilder;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;
use Neos\Neos\Ui\Fusion\Helper\WorkspaceHelper;
use Neos\Neos\Ui\Service\NodeClipboard;
use Neos\Neos\Ui\Service\NodePolicyService;
use Neos\Neos\Ui\Service\PublishingService;
use Neos\Neos\Ui\TypeConverter\ChangeCollectionConverter;
use Neos\Neos\Utility\NodeUriPathSegmentGenerator;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepository\Core\Feature\WorkspaceModification\Command\ChangeBaseWorkspace;
use Neos\ContentRepository\Core\SharedModel\Workspace\ContentStreamId;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\Redirect;
use Neos\ContentRepository\Core\Feature\WorkspaceModification\Exception\WorkspaceIsNotEmptyException;

class BackendServiceController extends ActionController
{
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
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

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
     * @Flow\Inject
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var NodePolicyService
     */
    protected $nodePolicyService;

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
     */
    /** @phpstan-ignore-next-line */
    public function changeAction(array $changes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;

        /** @param array<int,array<string,mixed>> $changes */
        $changes = $this->changeCollectionConverter->convert($changes, $contentRepositoryId);
        /** @var ChangeCollection $changes */
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
     * Publish all nodes
     */
    public function publishAllAction(): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);

        $currentAccount = $this->securityContext->getAccount();
        $workspaceName = NeosWorkspaceName::fromAccountIdentifier($currentAccount->getAccountIdentifier())
            ->toContentRepositoryWorkspaceName();
        $this->publishingService->publishWorkspace($contentRepository, $workspaceName);

        $success = new Success();
        $success->setMessage(sprintf('Published.'));

        $updateWorkspaceInfo = new UpdateWorkspaceInfo($contentRepositoryId, $workspaceName);
        $this->feedbackCollection->add($success);
        $this->feedbackCollection->add($updateWorkspaceInfo);
        $this->view->assign('value', $this->feedbackCollection);
    }

    /**
     * Publish nodes
     *
     * @param array $nodeContextPaths
     */
    /** @phpstan-ignore-next-line */
    public function publishAction(array $nodeContextPaths, string $targetWorkspaceName): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        try {
            $currentAccount = $this->securityContext->getAccount();
            $workspaceName = NeosWorkspaceName::fromAccountIdentifier($currentAccount->getAccountIdentifier())
                ->toContentRepositoryWorkspaceName();

            $nodeIdentifiersToPublish = [];
            foreach ($nodeContextPaths as $contextPath) {
                $nodeAddress = $nodeAddressFactory->createFromUriString($contextPath);
                $nodeIdentifiersToPublish[] = new NodeIdToPublishOrDiscard(
                    $nodeAddress->contentStreamId,
                    $nodeAddress->nodeAggregateId,
                    $nodeAddress->dimensionSpacePoint
                );
            }
            try {
                $contentRepository->handle(
                    PublishIndividualNodesFromWorkspace::create(
                        $workspaceName,
                        NodeIdsToPublishOrDiscard::create(...$nodeIdentifiersToPublish)
                    )
                )->block();
            } catch (NodeAggregateCurrentlyDoesNotExist $e) {
                throw new NodeAggregateCurrentlyDoesNotExist(
                    'Node could not be published, probably because of a missing parentNode. Please check that the parentNode has been published.',
                    1682762156
                );
            }

            $success = new Success();
            $success->setMessage(sprintf(
                'Published %d change(s) to %s.',
                count($nodeContextPaths),
                $targetWorkspaceName
            ));

            $updateWorkspaceInfo = new UpdateWorkspaceInfo($contentRepositoryId, $workspaceName);
            $this->feedbackCollection->add($success);
            $this->feedbackCollection->add($updateWorkspaceInfo);
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }

    /**
     * Discard nodes
     *
     * @param array $nodeContextPaths
     */
    /** @phpstan-ignore-next-line */
    public function discardAction(array $nodeContextPaths): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        try {
            $currentAccount = $this->securityContext->getAccount();
            $workspaceName = NeosWorkspaceName::fromAccountIdentifier($currentAccount->getAccountIdentifier())
                ->toContentRepositoryWorkspaceName();

            $nodeIdentifiersToDiscard = [];
            foreach ($nodeContextPaths as $contextPath) {
                $nodeAddress = $nodeAddressFactory->createFromUriString($contextPath);
                $nodeIdentifiersToDiscard[] = new NodeIdToPublishOrDiscard(
                    $nodeAddress->contentStreamId,
                    $nodeAddress->nodeAggregateId,
                    $nodeAddress->dimensionSpacePoint
                );
            }
            $contentRepository->handle(
                DiscardIndividualNodesFromWorkspace::create(
                    $workspaceName,
                    NodeIdsToPublishOrDiscard::create(...$nodeIdentifiersToDiscard)
                )
            )->block();

            $success = new Success();
            $success->setMessage(sprintf('Discarded %d node(s).', count($nodeContextPaths)));

            $updateWorkspaceInfo = new UpdateWorkspaceInfo($contentRepositoryId, $workspaceName);
            $this->feedbackCollection->add($success);
            $this->feedbackCollection->add($updateWorkspaceInfo);
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
        $nodeAddress = $nodeAddressFactory->createFromUriString($documentNode);

        $currentAccount = $this->securityContext->getAccount();
        $userWorkspaceName = NeosWorkspaceName::fromAccountIdentifier(
            $currentAccount->getAccountIdentifier()
        )->toContentRepositoryWorkspaceName();

        $command = ChangeBaseWorkspace::create($userWorkspaceName, WorkspaceName::fromString($targetWorkspaceName));
        try {
            $contentRepository->handle($command)->block();
        } catch (WorkspaceIsNotEmptyException $exception) {
            $error = new Error();
            $error->setMessage('Your personal workspace currently contains unpublished changes.'
                . ' In order to switch to a different target workspace you need to either publish'
                . ' or discard pending changes first.');

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
                $command->newContentStreamId,
                $nodeAddress->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );

        $documentNode = $subgraph->findNodeById($nodeAddress->nodeAggregateId);

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
                    throw new \Exception(sprintf(
                        'Wasn\'t able to locate any valid node in rootline of node %s in the workspace %s.',
                        $documentNode->nodeAggregateId->value,
                        $targetWorkspaceName
                    ), 1458814469);
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
     * @param array $nodes
     * @return void
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    /** @phpstan-ignore-next-line */
    public function copyNodesAction(array $nodes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        /** @var array<int,NodeAddress> $nodeAddresses */
        $nodeAddresses = array_map(
            fn (string $serializedNodeAddress) => $nodeAddressFactory->createFromUriString($serializedNodeAddress),
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
     * @param array $nodes
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    /** @phpstan-ignore-next-line */
    public function cutNodesAction(array $nodes): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        /** @var array<int,\Neos\Neos\FrontendRouting\NodeAddress> $nodeAddresses */
        $nodeAddresses = array_map(
            fn (string $serializedNodeAddress) => $nodeAddressFactory->createFromUriString($serializedNodeAddress),
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

    public function initializeLoadTreeAction(): void
    {
        $this->arguments['nodeTreeArguments']->getPropertyMappingConfiguration()->allowAllProperties();
    }

    /**
     * Load the nodetree
     */
    public function loadTreeAction(NodeTreeBuilder $nodeTreeArguments, bool $includeRoot = false): void
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;

        $nodeTreeArguments->setControllerContext($this->controllerContext);
        $this->view->assign('value', $nodeTreeArguments->build($contentRepositoryId, $includeRoot));
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
     */
    /** @phpstan-ignore-next-line */
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
                    'policy' => $this->nodePolicyService->getNodePolicyInformation($node),
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
     * @param array<NodeAddress> $nodes
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
                    'policy' => $this->nodePolicyService->getNodePolicyInformation($node)
                ];
            }
        }

        $this->view->assign('value', $result);
    }

    /**
     * Build and execute a flow query chain
     *
     * @param array $chain
     */
    /** @phpstan-ignore-next-line */
    public function flowQueryAction(array $chain): string
    {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;

        $createContext = array_shift($chain);
        $finisher = array_pop($chain);

        /** @var array<int,mixed> $payload */
        $payload = $createContext['payload'] ?? [];
        $flowQuery = new FlowQuery(array_map(
            fn ($envelope) => $this->nodeService->getNodeFromContextPath($envelope['$node'], $contentRepositoryId),
            $payload
        ));

        foreach ($chain as $operation) {
            // @phpstan-ignore-next-line
            $flowQuery = call_user_func_array([$flowQuery, $operation['type']], $operation['payload']);
        }

        $nodeInfoHelper = new NodeInfoHelper();
        $type = $finisher['type'] ?? null;
        $result = match ($type) {
            'get' => $nodeInfoHelper->renderNodes(array_filter($flowQuery->get()), $this->getControllerContext()),
            'getForTree' => $nodeInfoHelper->renderNodes(
                array_filter($flowQuery->get()),
                $this->getControllerContext(),
                true
            ),
            'getForTreeWithParents' => $nodeInfoHelper->renderNodesWithParents(
                array_filter($flowQuery->get()),
                $this->getControllerContext()
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
        $subgraph = $contentRepository->getContentGraph()->getSubgraph($contextNodeAddress->contentStreamId, $contextNodeAddress->dimensionSpacePoint, VisibilityConstraints::withoutRestrictions());
        $contextNode = $subgraph->findNodeById($contextNodeAddress->nodeAggregateId);

        $slug = $this->nodeUriPathSegmentGenerator->generateUriPathSegment($contextNode, $text);
        $this->view->assign('value', $slug);
    }
}
