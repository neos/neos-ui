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

use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Exception\WorkspaceDoesNotExist;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Repository\DomainRepository;
use Neos\Neos\Domain\Repository\SiteRepository;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\Domain\Service\WorkspaceNameBuilder;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\Neos\FrontendRouting\NodeUriBuilderFactory;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\InitialData\ConfigurationProviderInterface;
use Neos\Neos\Ui\Domain\InitialData\FrontendConfigurationProviderInterface;
use Neos\Neos\Ui\Domain\InitialData\InitialStateProviderInterface;
use Neos\Neos\Ui\Domain\InitialData\MenuProviderInterface;
use Neos\Neos\Ui\Domain\InitialData\NodeTypeGroupsAndRolesProviderInterface;
use Neos\Neos\Ui\Domain\InitialData\RoutesProviderInterface;
use Neos\Neos\Ui\Presentation\ApplicationView;

/**
 * @internal
 */
class BackendController extends ActionController
{
    /**
     * @var ApplicationView
     */
    protected $view;

    protected $defaultViewObjectName = ApplicationView::class;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var DomainRepository
     */
    protected $domainRepository;

    /**
     * @Flow\Inject
     * @var SiteRepository
     */
    protected $siteRepository;

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

    /**
     * @Flow\Inject
     * @var Context
     */
    protected $securityContext;

    /**
     * @Flow\Inject
     * @var ConfigurationProviderInterface
     */
    protected $configurationProvider;

    /**
     * @Flow\Inject
     * @var RoutesProviderInterface
     */
    protected $routesProvider;

    /**
     * @Flow\Inject
     * @var FrontendConfigurationProviderInterface
     */
    protected $frontendConfigurationProvider;

    /**
     * @Flow\Inject
     * @var NodeTypeGroupsAndRolesProviderInterface
     */
    protected $nodeTypeGroupsAndRolesProvider;

    /**
     * @Flow\Inject
     * @var MenuProviderInterface
     */
    protected $menuProvider;

    /**
     * @Flow\Inject
     * @var InitialStateProviderInterface
     */
    protected $initialStateProvider;

    /**
     * @Flow\Inject
     * @var NodeUriBuilderFactory
     */
    protected $nodeUriBuilderFactory;

    /**
     * Displays the backend interface
     *
     * @param string $node The node that will be displayed on the first tab
     * @return void
     */
    public function indexAction(string $node = null)
    {
        $siteDetectionResult = SiteDetectionResult::fromRequest($this->request->getHttpRequest());
        $contentRepository = $this->contentRepositoryRegistry->get($siteDetectionResult->contentRepositoryId);

        $nodeAddress = $node !== null ? NodeAddressFactory::create($contentRepository)->createFromUriString($node) : null;
        unset($node);
        $user = $this->userService->getBackendUser();

        if ($user === null) {
            $this->redirectToUri($this->uriBuilder->uriFor('index', [], 'Login', 'Neos.Neos'));
        }

        $currentAccount = $this->securityContext->getAccount();
        $workspaceName = WorkspaceNameBuilder::fromAccountIdentifier($currentAccount->getAccountIdentifier());

        try {
            $contentGraph = $contentRepository->getContentGraph($workspaceName);
        } catch (WorkspaceDoesNotExist) {
            // todo will cause infinite loop: https://github.com/neos/neos-development-collection/issues/4401
            $this->redirectToUri($this->uriBuilder->uriFor('index', [], 'Login', 'Neos.Neos'));
        }

        $backendControllerInternals = $this->contentRepositoryRegistry->buildService(
            $siteDetectionResult->contentRepositoryId,
            new BackendControllerInternalsFactory()
        );
        $defaultDimensionSpacePoint = $backendControllerInternals->getDefaultDimensionSpacePoint();

        $subgraph = $contentGraph->getSubgraph(
            $nodeAddress ? $nodeAddress->dimensionSpacePoint : $defaultDimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
        );

        // we assume that the ROOT node is always stored in the CR as "physical" node; so it is safe
        // to call the contentGraph here directly.
        $rootNodeAggregate = $contentGraph->findRootNodeAggregateByType(
            NodeTypeNameFactory::forSites()
        );
        $rootNode = $rootNodeAggregate->getNodeByCoveredDimensionSpacePoint($defaultDimensionSpacePoint);

        $siteNode = $subgraph->findNodeByPath(
            $siteDetectionResult->siteNodeName->toNodeName(),
            $rootNode->aggregateId
        );

        if (!$nodeAddress) {
            $node = $siteNode;
        } else {
            $node = $subgraph->findNodeById($nodeAddress->nodeAggregateId);
        }

        $this->view->setOption('title', 'Neos CMS');
        $this->view->assign('initialData', [
            'configuration' =>
                $this->configurationProvider->getConfiguration(
                    contentRepository: $contentRepository,
                    uriBuilder: $this->controllerContext->getUriBuilder(),
                ),
            'routes' =>
                $this->routesProvider->getRoutes(
                    uriBuilder: $this->controllerContext->getUriBuilder()
                ),
            'frontendConfiguration' =>
                $this->frontendConfigurationProvider->getFrontendConfiguration(
                    actionRequest: $this->request,
                ),
            'nodeTypes' =>
                $this->nodeTypeGroupsAndRolesProvider->getNodeTypes(),
            'menu' =>
                $this->menuProvider->getMenu(
                    actionRequest: $this->request,
                ),
            'initialState' =>
                $this->initialStateProvider->getInitialState(
                    actionRequest: $this->request,
                    documentNode: $node,
                    site: $siteNode,
                    user: $user,
                ),
        ]);
    }

    /**
     * @throws \Neos\Flow\Mvc\Exception\StopActionException
     */
    public function redirectToAction(string $node): void
    {
        $this->response->setHttpHeader('Cache-Control', [
            'no-cache',
            'no-store'
        ]);

        $nodeAddress = NodeAddress::fromJsonString($node);

        $this->redirectToUri(
            $this->nodeUriBuilderFactory->forActionRequest($this->request)
                ->uriFor($nodeAddress)
        );
    }
}
