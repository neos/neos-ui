<?php
namespace Neos\Neos\Ui\Controller;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".           *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\ResourceManagement\ResourceManager;
use Neos\Flow\Session\SessionInterface;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\Neos\Controller\Backend\MenuHelper;
use Neos\Neos\Domain\Repository\DomainRepository;
use Neos\Neos\Domain\Repository\SiteRepository;
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

    public function initializeView(ViewInterface $view)
    {
        $view->setFusionPath('backend');
    }

    /**
     * Displays the backend interface
     *
     * @param NodeInterface $node The node that will be displayed on the first tab
     * @return void
     */
    public function indexAction(NodeInterface $node = null)
    {
        $this->session->start();
        $this->session->putData('__neosEnabled__', true);

        if ($user = $this->userService->getBackendUser()) {
            $workspaceName = $this->userService->getPersonalWorkspaceName();
            if ($node === null) {
                $reflectionMethod = new \ReflectionMethod($this->backendRedirectionService, 'getLastVisitedNode');
                $reflectionMethod->setAccessible(true);
                $node = $reflectionMethod->invoke($this->backendRedirectionService, $workspaceName);
            }

            $contentContext = ($node ? $node->getContext() : $this->createContext($workspaceName));

            $contentContext->getWorkspace();
            $this->persistenceManager->persistAll();

            $siteNode = $contentContext->getCurrentSiteNode();

            if ($node === null) {
                $node = $siteNode;
            }

            $this->view->assign('user', $user);
            $this->view->assign('documentNode', $node);
            $this->view->assign('site', $siteNode);
            $this->view->assign('headScripts', $this->styleAndJavascriptInclusionService->getHeadScripts());
            $this->view->assign('headStylesheets', $this->styleAndJavascriptInclusionService->getHeadStylesheets());
            $this->view->assign('sitesForMenu', $this->menuHelper->buildSiteList($this->getControllerContext()));

            $this->view->assign('interfaceLanguage', $this->userService->getInterfaceLanguage());
            return;
        }

        $this->redirectToUri($this->uriBuilder->uriFor('index', array(), 'Login', 'Neos.Neos'));
    }

    /**
     * Deactivates the new UI and redirects back to the old one
     *
     * @return void
     */
    public function deactivateAction()
    {
        $this->session->start();
        $this->session->putData('__neosEnabled__', false);

        $this->redirectToUri($this->uriBuilder->uriFor('index', array(), 'Backend\Backend', 'Neos.Neos'));
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
            'inaccessibleContentShown' => true
        );

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
