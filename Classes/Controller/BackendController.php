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
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Flow\Security\Context;
use Neos\Flow\Session\SessionInterface;
use Neos\Neos\Domain\Repository\DomainRepository;
use Neos\Neos\Domain\Repository\SiteRepository;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\Domain\Service\WorkspaceNameBuilder;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;
use Neos\Neos\Service\BackendRedirectionService;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\ConfigurationProviderInterface;
use Neos\Neos\Ui\Domain\FrontendConfigurationProviderInterface;
use Neos\Neos\Ui\Domain\InitialStateProviderInterface;
use Neos\Neos\Ui\Domain\MenuProviderInterface;
use Neos\Neos\Ui\Domain\NodeTypeGroupsAndRolesProviderInterface;
use Neos\Neos\Ui\Domain\RoutesProviderInterface;
use Neos\Neos\Ui\Presentation\ApplicationView;

class BackendController extends ActionController
{
    /**
     * @var ApplicationView
     */
    protected $view;

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
     * @var SessionInterface
     */
    protected $session;

    /**
     * @Flow\Inject(lazy=false)
     * @var BackendRedirectionService
     */
    protected $backendRedirectionService;

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
        $this->session->start();
        $this->session->putData('__neosLegacyUiEnabled__', false);
        $user = $this->userService->getBackendUser();

        if ($user === null) {
            $this->redirectToUri($this->uriBuilder->uriFor('index', [], 'Login', 'Neos.Neos'));
        }

        $currentAccount = $this->securityContext->getAccount();
        $workspace = $contentRepository->getWorkspaceFinder()->findOneByName(
            WorkspaceNameBuilder::fromAccountIdentifier($currentAccount->getAccountIdentifier())
        );
        if (is_null($workspace)) {
            $this->redirectToUri($this->uriBuilder->uriFor('index', [], 'Login', 'Neos.Neos'));
        }

        $backendControllerInternals = $this->contentRepositoryRegistry->buildService(
            $siteDetectionResult->contentRepositoryId,
            new BackendControllerInternalsFactory()
        );
        $defaultDimensionSpacePoint = $backendControllerInternals->getDefaultDimensionSpacePoint();

        $subgraph = $contentRepository->getContentGraph()->getSubgraph(
            $workspace->currentContentStreamId,
            $nodeAddress ? $nodeAddress->dimensionSpacePoint : $defaultDimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
        );

        // we assume that the ROOT node is always stored in the CR as "physical" node; so it is safe
        // to call the contentGraph here directly.
        $rootNodeAggregate = $contentRepository->getContentGraph()->findRootNodeAggregateByType(
            $workspace->currentContentStreamId,
            NodeTypeNameFactory::forSites()
        );
        $rootNode = $rootNodeAggregate->getNodeByCoveredDimensionSpacePoint($defaultDimensionSpacePoint);

        $siteNode = $subgraph->findNodeByPath(
            $siteDetectionResult->siteNodeName->toNodeName(),
            $rootNode->nodeAggregateId
        );

        if (!$nodeAddress) {
            // TODO: fix resolving node address from session?
            $node = $siteNode;
        } else {
            $node = $subgraph->findNodeById($nodeAddress->nodeAggregateId);
        }

        $this->view->assignMultiple([
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
                    controllerContext: $this->controllerContext,
                ),
            'nodeTypes' =>
                $this->nodeTypeGroupsAndRolesProvider->getNodeTypes(),
            'menu' =>
                $this->menuProvider->getMenu(
                    controllerContext: $this->controllerContext,
                ),
            'initialState' =>
                $this->initialStateProvider->getInitialState(
                    controllerContext: $this->controllerContext,
                    contentRepositoryId: $siteDetectionResult->contentRepositoryId,
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
        $siteDetectionResult = SiteDetectionResult::fromRequest($this->request->getHttpRequest());

        $contentRepository = $this->contentRepositoryRegistry->get($siteDetectionResult->contentRepositoryId);

        $nodeAddress = NodeAddressFactory::create($contentRepository)->createFromUriString($node);
        $this->response->setHttpHeader('Cache-Control', [
            'no-cache',
            'no-store'
        ]);
        $this->redirect('show', 'Frontend\Node', 'Neos.Neos', ['node' => $nodeAddress]);
    }
}
