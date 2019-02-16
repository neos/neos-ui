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

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
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
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\Service\StyleAndJavascriptInclusionService;
use Neos\Neos\Ui\Service\NodeClipboard;

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
     */
    public function indexAction(NodeInterface $node = null)
    {
        $this->session->start();
        $this->session->putData('__neosLegacyUiEnabled__', false);
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
        $this->view->assign('clipboardNode', $this->clipboard->getNodeContextPath());
        $this->view->assign('clipboardMode', $this->clipboard->getMode());
        $this->view->assign('headScripts', $this->styleAndJavascriptInclusionService->getHeadScripts());
        $this->view->assign('headStylesheets', $this->styleAndJavascriptInclusionService->getHeadStylesheets());
        $this->view->assign('splashScreenPartial', $this->settings['splashScreen']['partial']);
        $this->view->assign('sitesForMenu', $this->menuHelper->buildSiteList($this->getControllerContext()));

        $this->view->assign('interfaceLanguage', $this->userService->getInterfaceLanguage());
    }

    /**
     * Deactivates the new UI and redirects back to the old one
     *
     * @param NodeInterface|null $node
     * @return void
     */
    public function deactivateAction(NodeInterface $node = null)
    {
        if ($node === null) {
            $node = $this->findNodeToEdit();
        }

        $this->session->start();
        $this->session->putData('__neosLegacyUiEnabled__', true);

        $this->redirect('show', 'Frontend\Node', 'Neos.Neos', ['node' => $node]);
    }

    /**
     * @param NodeInterface $node
     * @throws \Neos\Flow\Mvc\Exception\StopActionException
     */
    public function redirectToAction(NodeInterface $node)
    {
        $this->response->getHeaders()->setCacheControlDirective('no-cache');
        $this->response->getHeaders()->setCacheControlDirective('no-store');
        $this->redirect('show', 'Frontend\Node', 'Neos.Neos', ['node' => $node]);
    }

    /**
     * @return NodeInterface|null
     */
    protected function getSiteNodeForLoggedInUser()
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
     */
    protected function findNodeToEdit()
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
    protected function createContext($workspaceName)
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
