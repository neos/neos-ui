<?php
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

use Neos\ContentGraph\DoctrineDbalAdapter\Domain\Repository\ContentGraph;
use Neos\ContentGraph\DoctrineDbalAdapter\Domain\Repository\NodeFactory;
use Neos\ContentRepository\Domain\Context\Dimension\ContentDimensionSourceInterface;
use Neos\ContentRepository\Domain\Context\Parameters\ContextParameters;
use Neos\ContentRepository\Domain\Projection\Content\NodeInterface;
use Neos\ContentRepository\Domain\Projection\Content\TraversableNode;
use Neos\ContentRepository\Domain\Projection\Workspace\WorkspaceFinder;
use Neos\ContentRepository\Domain\ValueObject\DimensionSpacePoint;
use Neos\ContentRepository\Domain\ValueObject\NodeName;
use Neos\ContentRepository\Domain\ValueObject\NodeTypeName;
use Neos\ContentRepository\Domain\ValueObject\WorkspaceName;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\ResourceManagement\ResourceManager;
use Neos\Flow\Session\SessionInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\Neos\Controller\Backend\MenuHelper;
use Neos\Neos\Domain\Projection\Site\SiteFinder;
use Neos\Neos\Domain\Repository\DomainRepository;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\BackendRedirectionService;
use Neos\Neos\Service\UserService;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Fusion\View\FusionView;
use Neos\Flow\Mvc\View\ViewInterface;
use Neos\Neos\Ui\Domain\Service\StyleAndJavascriptInclusionService;

class BackendController extends ActionController
{

    /**
     * @var string
     */
    protected $defaultViewObjectName = 'Neos\Neos\Ui\View\BackendFusionView';

    /**
     * @var FusionView
     */
    protected $view;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contextFactory;

    /**
     * @Flow\Inject
     * @var DomainRepository
     */
    protected $domainRepository;

    /**
     * @Flow\Inject
     * @var SiteFinder
     */
    protected $siteFinder;

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
     * @Flow\Inject
     * @var ResourceManager
     */
    protected $resourceManager;

    /**
     * @Flow\Inject
     * @var MenuHelper
     */
    protected $menuHelper;

    /**
     * @Flow\Inject(lazy=false)
     * @var BackendRedirectionService
     */
    protected $backendRedirectionService;

    /**
     * @Flow\Inject
     * @var ContentGraph
     */
    protected $contentGraph;


    /**
     * @Flow\Inject
     * @var NodeFactory
     */
    protected $nodeFactory;


    /**
     * @Flow\Inject
     * @var WorkspaceFinder
     */
    protected $workspaceFinder;

    /**
     * @Flow\Inject
     * @var StyleAndJavascriptInclusionService
     */
    protected $styleAndJavascriptInclusionService;

    public function initializeView(ViewInterface $view)
    {
        $view->setFusionPath('backend');
    }

    /**
     * Displays the backend interface
     *
     * @param string|null $workspaceName
     * @param string|null $dimensionSpacePoint
     * @param string|null $documentNodeAggregateIdentifier
     * @return void
     * @throws \Doctrine\DBAL\DBALException
     * @throws \Exception
     * @throws \Neos\Flow\Mvc\Exception\StopActionException
     * @throws \Neos\Flow\Mvc\Exception\UnsupportedRequestTypeException
     * @throws \Neos\Flow\Mvc\Routing\Exception\MissingActionNameException
     * @throws \Neos\Flow\Session\Exception\SessionNotStartedException
     */
    public function indexAction(string $workspaceName = null, string $dimensionSpacePoint = null, string $documentNodeAggregateIdentifier = null)
    {
        $this->session->start();
        $this->session->putData('__neosLegacyUiEnabled__', false);
        $user = $this->userService->getBackendUser();

        if ($user === null) {
            $this->redirectToUri($this->uriBuilder->uriFor('index', [], 'Login', 'Neos.Neos'));
        }

        /*if ($documentNodeAggregateIdentifier === null) {
            $node = $this->findNodeToEdit();
            //$contentQuery = ContentQuery::fromNode($node, $this->getRootNodeIdentifier());
        } else {
            // TODO!!!
            $contentQuery = new ContentQuery(new NodeAggregateIdentifier($documentNodeAggregateIdentifier), new WorkspaceName($workspaceName), DimensionSpacePoint::fromUriRepresentation($dimensionSpacePoint), $this->getSiteNodeForLoggedInUser()->getNodeAggregateIdentifier(), $this->getRootNodeIdentifier());
            $node = $this->nodeFactory->findNodeForContentQuery($contentQuery);
        }*/

        $user = $this->userService->getBackendUser();
        if ($user === null) {
            return null;
        }

        $workspaceName = $this->userService->getPersonalWorkspaceName();
        $workspace = $this->workspaceFinder->findOneByName(new WorkspaceName($workspaceName));
        $subgraph = $this->contentGraph->getSubgraphByIdentifier($workspace->getCurrentContentStreamIdentifier(), $this->findDefaultDimensionSpacePoint());
        $siteNode = $subgraph->findChildNodeConnectedThroughEdgeName($this->getRootNodeIdentifier(), new NodeName($this->siteFinder->findDefault()->nodeName));
        $siteNode = new TraversableNode($siteNode, $subgraph, new ContextParameters(new \DateTimeImmutable(), [], true, false));

        $this->view->assign('user', $user);
        $this->view->assign('documentNode', $siteNode); // TODO: document node handling
        $this->view->assign('site', $siteNode);
        $this->view->assign('headScripts', $this->styleAndJavascriptInclusionService->getHeadScripts());
        $this->view->assign('headStylesheets', $this->styleAndJavascriptInclusionService->getHeadStylesheets());
        $this->view->assign('sitesForMenu', $this->menuHelper->buildSiteList($this->getControllerContext()));

        $this->view->assignMultiple([
            'subgraph' => $subgraph,
            'contextParameters' => new ContextParameters(new \DateTimeImmutable(), [], true, true)
        ]);

        $this->view->assign('interfaceLanguage', $this->userService->getInterfaceLanguage());
    }

    /**
     * @return NodeInterface|null
     */
    protected function getSiteNodeForLoggedInUser()
    {
    }

    /**
     * @Flow\Inject
     * @var ContentDimensionSourceInterface
     */
    protected $contentDimensionSource;

    protected function findDefaultDimensionSpacePoint(): DimensionSpacePoint {
        $coordinates = [];
        foreach ($this->contentDimensionSource->getContentDimensionsOrderedByPriority() as $dimension) {
            $coordinates[(string)$dimension->getIdentifier()] = (string)$dimension->getDefaultValue();
        }

        return new DimensionSpacePoint($coordinates);
    }

    /**
     * @return NodeInterface|null
     */
    protected function findNodeToEdit()
    {

        $siteNode = $this->getSiteNodeForLoggedInUser();
        return $siteNode; // TODO
        $reflectionMethod = new \ReflectionMethod($this->backendRedirectionService, 'getLastVisitedNode');
        $reflectionMethod->setAccessible(true);
        $node = $reflectionMethod->invoke($this->backendRedirectionService, $siteNode->getContext()->getWorkspaceName());

        if ($node === null) {
            $node = $siteNode;
        }

        return $node;
    }

    /**
     * Create a ContentContext to be used for the backend redirects.
     *
     * @param string $workspaceName
     * @return ContentContext
     */
    protected function createContext($workspaceName)
    {
        $contextProperties = array(
            'workspaceName' => $workspaceName,
            'invisibleContentShown' => true,
            'inaccessibleContentShown' => true,
            'rootNodeIdentifier' => $this->getRootNodeIdentifier()
        );

        $currentDomain = $this->domainRepository->findOneByActiveRequest();

        if ($currentDomain !== null) {
            $contextProperties['currentSite'] = $currentDomain->getSite();
            $contextProperties['currentDomain'] = $currentDomain;
        } else {
            $contextProperties['currentSite'] = $this->siteFinder->findFirstOnline();
        }

        return $this->contextFactory->create($contextProperties);
    }

    /**
     * @return \Neos\ContentRepository\Domain\ValueObject\NodeIdentifier
     * @throws \Doctrine\DBAL\DBALException
     * @throws \Exception
     */
    protected function getRootNodeIdentifier(): \Neos\ContentRepository\Domain\ValueObject\NodeIdentifier
    {
        return $this->contentGraph->findRootNodeByType(new NodeTypeName('Neos.Neos:Sites'))->getNodeIdentifier();
    }
}
