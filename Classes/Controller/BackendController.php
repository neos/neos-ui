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

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Http\Component\SetHeaderComponent;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\Exception\NoSuchArgumentException;
use Neos\Flow\Mvc\Exception\StopActionException;
use Neos\Flow\Mvc\Exception\UnsupportedRequestTypeException;
use Neos\Flow\Mvc\Routing\Exception\MissingActionNameException;
use Neos\Flow\Mvc\View\ViewInterface;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Flow\ResourceManagement\ResourceManager;
use Neos\Flow\Session\SessionInterface;
use Neos\Fusion\View\FusionView;
use Neos\Neos\Controller\Backend\MenuHelper;
use Neos\Neos\Domain\Repository\DomainRepository;
use Neos\Neos\Domain\Repository\SiteRepository;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\BackendRedirectionService;
use Neos\Neos\Service\LinkingService;
use Neos\Neos\Service\UserService;
use Neos\Neos\TypeConverter\NodeConverter;
use Neos\Neos\Ui\Domain\Service\StyleAndJavascriptInclusionService;
use Neos\Neos\Ui\Service\NodeClipboard;
use Neos\Neos\Ui\View\BackendFusionView;

class BackendController extends ActionController
{

    /**
     * @var string
     */
    protected $defaultViewObjectName = BackendFusionView::class;

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
     * @var StyleAndJavascriptInclusionService
     */
    protected $styleAndJavascriptInclusionService;

    /**
     * @Flow\Inject
     * @var NodeClipboard
     */
    protected $clipboard;

    /**
     * @Flow\Inject
     * @var LinkingService
     */
    protected $linkingService;

    /**
     * Initializes the view before invoking an action method.
     *
     * @param ViewInterface $view The view to be initialized
     * @return void
     */
    public function initializeView(ViewInterface $view)
    {
        $view->setFusionPath('backend');
    }

    /**
     * Displays the backend interface
     *
     * @Flow\IgnoreValidation("$node")
     * @param NodeInterface $node The node that will be displayed on the first tab
     * @return void
     * @throws StopActionException
     * @throws UnsupportedRequestTypeException
     * @throws MissingActionNameException
     * @throws \ReflectionException
     * @throws \Neos\Flow\Http\Exception
     */
    public function indexAction(NodeInterface $node = null): void
    {
        $user = $this->userService->getBackendUser();

        if ($user === null) {
            $this->redirectToUri($this->uriBuilder->uriFor('index', [], 'Login', 'Neos.Neos'));
        }

        if ($node === null) {
            $node = $this->findNodeToEdit();
        }

        $siteNode = $node->getContext()->getCurrentSiteNode();

        $this->view->assign('user', $user);
        $this->view->assign('documentNode', $node);
        $this->view->assign('site', $siteNode);
        $this->view->assign('clipboardNodes', $this->clipboard->getNodeContextPaths());
        $this->view->assign('clipboardMode', $this->clipboard->getMode());
        $this->view->assign('headScripts', $this->styleAndJavascriptInclusionService->getHeadScripts());
        $this->view->assign('headStylesheets', $this->styleAndJavascriptInclusionService->getHeadStylesheets());
        $this->view->assign('splashScreenPartial', $this->settings['splashScreen']['partial']);
        $this->view->assign('sitesForMenu', $this->menuHelper->buildSiteList($this->getControllerContext()));
        $this->view->assign('modulesForMenu', $this->menuHelper->buildModuleList($this->getControllerContext()));

        $this->view->assign('interfaceLanguage', $this->userService->getInterfaceLanguage());
    }

    /**
     * Allow invisible nodes to be redirected to
     *
     * @return void
     * @throws NoSuchArgumentException
     */
    protected function initializeRedirectToAction(): void
    {
        // use this constant only if available (became available with patch level releases in Neos 4.0 and up)
        if (defined(NodeConverter::class . '::INVISIBLE_CONTENT_SHOWN')) {
            $this->arguments->getArgument('node')->getPropertyMappingConfiguration()->setTypeConverterOption(NodeConverter::class, NodeConverter::INVISIBLE_CONTENT_SHOWN, true);
        }
    }

    /**
     * @param NodeInterface $node
     * @param string $presetBaseNodeType
     * @throws MissingActionNameException
     * @throws StopActionException
     * @throws UnsupportedRequestTypeException
     * @throws \Neos\Flow\Http\Exception
     * @throws \Neos\Flow\Persistence\Exception\IllegalObjectTypeException
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     * @throws \Neos\Neos\Exception
     */
    public function redirectToAction(NodeInterface $node, string $presetBaseNodeType = null): void
    {
        $this->response->setComponentParameter(SetHeaderComponent::class, 'Cache-Control', [
            'no-cache',
            'no-store'
        ]);
        $this->redirectToUri($this->linkingService->createNodeUri($this->controllerContext, $node, null, null, false, ['presetBaseNodeType' => $presetBaseNodeType]));
    }

    /**
     * @return NodeInterface|null
     */
    protected function getSiteNodeForLoggedInUser(): ?NodeInterface
    {
        $user = $this->userService->getBackendUser();
        if ($user === null) {
            return null;
        }

        $workspaceName = $this->userService->getPersonalWorkspaceName();
        $contentContext = $this->createContext($workspaceName);

        return $contentContext->getCurrentSiteNode();
    }

    /**
     * @return NodeInterface|null
     * @throws \ReflectionException
     */
    protected function findNodeToEdit(): ?NodeInterface
    {
        $siteNode = $this->getSiteNodeForLoggedInUser();
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
    protected function createContext(string $workspaceName): ?ContentContext
    {
        $contextProperties = [
            'workspaceName' => $workspaceName,
            'invisibleContentShown' => true,
            'inaccessibleContentShown' => true
        ];

        $currentDomain = $this->domainRepository->findOneByActiveRequest();

        if ($currentDomain !== null) {
            $contextProperties['currentSite'] = $currentDomain->getSite();
            $contextProperties['currentDomain'] = $currentDomain;
        } else {
            $contextProperties['currentSite'] = $this->siteRepository->findFirstOnline();
        }

        return $this->contextFactory->create($contextProperties);
    }
}
