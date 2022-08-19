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

use Neos\ContentRepository\Feature\Common\NodeIdentifiersToPublishOrDiscard;
use Neos\ContentRepository\Feature\Common\NodeIdentifierToPublishOrDiscard;
use Neos\ContentRepository\SharedModel\NodeAddressFactory;
use Neos\ContentRepository\SharedModel\VisibilityConstraints;
use Neos\ContentRepository\Feature\WorkspaceDiscarding\Command\DiscardIndividualNodesFromWorkspace;
use Neos\ContentRepository\Feature\WorkspacePublication\Command\PublishIndividualNodesFromWorkspace;
use Neos\ContentRepository\SharedModel\User\UserIdentifier;
use Neos\ContentRepository\SharedModel\NodeAddress;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Neos\Domain\Model\WorkspaceName as NeosWorkspaceName;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\View\JsonView;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Model\User;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;
use Neos\Neos\Ui\ContentRepository\Service\NodeService;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;
use Neos\Neos\Ui\Domain\Model\ChangeCollection;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;
use Neos\Neos\Ui\Fusion\Helper\WorkspaceHelper;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\Model\FeedbackCollection;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Error;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Info;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Success;
use Neos\Neos\Ui\Domain\Service\NodeTreeBuilder;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Neos\Ui\Service\NodeClipboard;
use Neos\Neos\Ui\Service\NodePolicyService;
use Neos\Neos\Ui\Service\PublishingService;
use Neos\Neos\Ui\TypeConverter\ChangeCollectionConverter;

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
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;

        /** @param array<int,array<string,mixed>> $changes */
        $changes = $this->changeCollectionConverter->convert($changes, $contentRepositoryIdentifier);
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
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);

        $currentAccount = $this->securityContext->getAccount();
        $workspaceName = NeosWorkspaceName::fromAccountIdentifier($currentAccount->getAccountIdentifier())
            ->toContentRepositoryWorkspaceName();
        $this->publishingService->publishWorkspace($contentRepository, $workspaceName);

        $success = new Success();
        $success->setMessage(sprintf('Published.'));

        $updateWorkspaceInfo = new UpdateWorkspaceInfo($contentRepositoryIdentifier, $workspaceName);
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
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        try {
            $currentAccount = $this->securityContext->getAccount();
            $workspaceName = NeosWorkspaceName::fromAccountIdentifier($currentAccount->getAccountIdentifier())
                ->toContentRepositoryWorkspaceName();

            $nodeIdentifiersToPublish = [];
            foreach ($nodeContextPaths as $contextPath) {
                $nodeAddress = $nodeAddressFactory->createFromUriString($contextPath);
                $nodeIdentifiersToPublish[] = new NodeIdentifierToPublishOrDiscard(
                    $nodeAddress->contentStreamIdentifier,
                    $nodeAddress->nodeAggregateIdentifier,
                    $nodeAddress->dimensionSpacePoint
                );
            }
            $contentRepository->handle(
                PublishIndividualNodesFromWorkspace::create(
                    $workspaceName,
                    NodeIdentifiersToPublishOrDiscard::create(...$nodeIdentifiersToPublish),
                    $this->getCurrentUserIdentifier()
                )
            )->block();

            $success = new Success();
            $success->setMessage(sprintf(
                'Published %d change(s) to %s.',
                count($nodeContextPaths),
                $targetWorkspaceName
            ));

            $updateWorkspaceInfo = new UpdateWorkspaceInfo($contentRepositoryIdentifier, $workspaceName);
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
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        try {
            $currentAccount = $this->securityContext->getAccount();
            $workspaceName = NeosWorkspaceName::fromAccountIdentifier($currentAccount->getAccountIdentifier())
                ->toContentRepositoryWorkspaceName();

            $nodeIdentifiersToDiscard = [];
            foreach ($nodeContextPaths as $contextPath) {
                $nodeAddress = $nodeAddressFactory->createFromUriString($contextPath);
                $nodeIdentifiersToDiscard[] = new NodeIdentifierToPublishOrDiscard(
                    $nodeAddress->contentStreamIdentifier,
                    $nodeAddress->nodeAggregateIdentifier,
                    $nodeAddress->dimensionSpacePoint
                );
            }
            $contentRepository->handle(
                DiscardIndividualNodesFromWorkspace::create(
                    $workspaceName,
                    NodeIdentifiersToPublishOrDiscard::create(...$nodeIdentifiersToDiscard),
                    $this->getCurrentUserIdentifier()
                )
            )->block();

            $success = new Success();
            $success->setMessage(sprintf('Discarded %d node(s).', count($nodeContextPaths)));

            $updateWorkspaceInfo = new UpdateWorkspaceInfo($contentRepositoryIdentifier, $workspaceName);
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
     * @param Node $documentNode
     * @return void
     * @throws \Exception
     */
    public function changeBaseWorkspaceAction(string $targetWorkspaceName, Node $documentNode)
    {
        try {
            throw new \BadMethodCallException('changeBaseWorkspaceAction is not yet implemented', 1645607154);
            /*
            $targetWorkspace = $this->workspaceFinder->findOneByName(WorkspaceName::fromString($targetWorkspaceName));
            $currentAccount = $this->securityContext->getAccount();
            $workspaceName = NeosWorkspaceName::fromAccountIdentifier(
                $currentAccount->getAccountIdentifier()
            )->toContentRepositoryWorkspaceName();
            $userWorkspace = $this->workspaceFinder->findOneByName($workspaceName);

            #if (count($this->workspaceService->getPublishableNodeInfo($userWorkspace)) > 0) {
            #    // TODO: proper error dialog
            #    throw new \Exception(
            #        'Your personal workspace currently contains unpublished changes.'
            #            . ' In order to switch to a different target workspace you need to either publish'
            #            . ' or discard pending changes first.'
            #    );
            #

            #$userWorkspace->setBaseWorkspace($targetWorkspace);
            #$this->workspaceFinder->update($userWorkspace);

            $success = new Success();
            $success->setMessage(sprintf('Switched base workspace to %s.', $targetWorkspaceName));
            $this->feedbackCollection->add($success);

            $updateWorkspaceInfo = new UpdateWorkspaceInfo();
            #$updateWorkspaceInfo->setWorkspace($userWorkspace);
            $this->feedbackCollection->add($updateWorkspaceInfo);

            // Construct base workspace context
            $originalContext = $documentNode->getContext();
            $contextProperties = $documentNode->getContext()->getProperties();
            $contextProperties['workspaceName'] = $targetWorkspaceName;
            $contentContext = $this->contextFactory->create($contextProperties);

            // If current document node doesn't exist in the base workspace,
            // traverse its parents to find the one that exists
            $redirectNode = $documentNode;
            while (true) {
                $redirectNodeInBaseWorkspace = $contentContext->getNodeByIdentifier($redirectNode->getIdentifier());
                if ($redirectNodeInBaseWorkspace) {
                    break;
                } else {
                    $redirectNode = $redirectNode->getParent();
                    // get parent always returns Node
                    if (!$redirectNode) {
                        throw new \Exception(sprintf(
                            'Wasn\'t able to locate any valid node in rootline of node %s in the workspace %s.',
                            $documentNode->getContextPath(),
                            $targetWorkspaceName
                        ), 1458814469);
                    }
                }
            }

            // If current document node exists in the base workspace, then reload, else redirect
            if ($redirectNode === $documentNode) {
                $reloadDocument = new ReloadDocument();
                $reloadDocument->setNode($documentNode);
                $this->feedbackCollection->add($reloadDocument);
            } else {
                $redirect = new Redirect();
                $redirect->setNode($redirectNode);
                $this->feedbackCollection->add($redirect);
            }

            $this->persistenceManager->persistAll();
            */
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }


    /**
     * Persists the clipboard node on copy
     *
     * @param array $nodes
     * @return void
     * @throws \Neos\ContentRepository\SharedModel\NodeAddressCannotBeSerializedException
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    /** @phpstan-ignore-next-line */
    public function copyNodesAction(array $nodes): void
    {
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        /** @var array<int,NodeAddress> $nodeAddresses */
        $nodeAddresses = array_map(
            fn (string $serializedNodeAddress) =>
            $nodeAddressFactory->createFromUriString($serializedNodeAddress),
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
     * @throws \Neos\ContentRepository\SharedModel\NodeAddressCannotBeSerializedException
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    /** @phpstan-ignore-next-line */
    public function cutNodesAction(array $nodes): void
    {
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        /** @var array<int,NodeAddress> $nodeAddresses */
        $nodeAddresses = array_map(
            fn (string $serializedNodeAddress) =>
            $nodeAddressFactory->createFromUriString($serializedNodeAddress),
            $nodes
        );

        $this->clipboard->cutNodes($nodeAddresses);
    }

    public function getWorkspaceInfoAction(): void
    {
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;
        $workspaceHelper = new WorkspaceHelper();
        $personalWorkspaceInfo = $workspaceHelper->getPersonalWorkspace($contentRepositoryIdentifier);
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
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;

        $nodeTreeArguments->setControllerContext($this->controllerContext);
        $this->view->assign('value', $nodeTreeArguments->build($contentRepositoryIdentifier, $includeRoot));
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
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        $result = [];
        foreach ($nodes as $nodeAddressString) {
            $nodeAddress = $nodeAddressFactory->createFromUriString($nodeAddressString);
            $subgraph = $contentRepository->getContentGraph()->getSubgraph(
                $nodeAddress->contentStreamIdentifier,
                $nodeAddress->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );
            $node = $subgraph->findNodeByNodeAggregateIdentifier($nodeAddress->nodeAggregateIdentifier);

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
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);

        $result = [];
        foreach ($nodes as $nodeAddress) {
            $subgraph = $contentRepository->getContentGraph()->getSubgraph(
                $nodeAddress->contentStreamIdentifier,
                $nodeAddress->dimensionSpacePoint,
                VisibilityConstraints::withoutRestrictions()
            );
            $node = $subgraph->findNodeByNodeAggregateIdentifier($nodeAddress->nodeAggregateIdentifier);
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
        $contentRepositoryIdentifier = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryIdentifier;

        $createContext = array_shift($chain);
        $finisher = array_pop($chain);

        /** @var array<int,mixed> $payload */
        $payload = $createContext['payload'] ?? [];
        $flowQuery = new FlowQuery(array_map(
            fn ($envelope) => $this->nodeService->getNodeFromContextPath($envelope['$node'], $contentRepositoryIdentifier),
            $payload
        ));

        foreach ($chain as $operation) {
            // @phpstan-ignore-next-line
            $flowQuery = call_user_func_array([$flowQuery, $operation['type']], $operation['payload']);
        }

        $nodeInfoHelper = new NodeInfoHelper();
        $type = $finisher['type'] ?? null;
        $result = match ($type) {
            'get' => $nodeInfoHelper->renderNodes($flowQuery->get(), $this->getControllerContext()),
            'getForTree' => $nodeInfoHelper->renderNodes(
                $flowQuery->get(),
                $this->getControllerContext(),
                true
            ),
            'getForTreeWithParents' => $nodeInfoHelper->renderNodesWithParents(
                $flowQuery->get(),
                $this->getControllerContext()
            ),
            default => []
        };

        return json_encode($result, JSON_THROW_ON_ERROR);
    }

    protected function getCurrentUserIdentifier(): UserIdentifier
    {
        /** @var User $backendUser */
        $backendUser = $this->userService->getBackendUser();
        return UserIdentifier::fromString(
            $this->persistenceManager->getIdentifierByObject($backendUser)
        );
    }
}
