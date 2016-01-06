<?php
namespace PackageFactory\Guevara\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "PackageFactory.Guevara".*
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\ActionController;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\TYPO3CR\Domain\Service\ContextFactoryInterface;
use TYPO3\Neos\Domain\Repository\DomainRepository;
use TYPO3\Neos\Domain\Repository\SiteRepository;
use TYPO3\Neos\Domain\Service\ContentContext;
use TYPO3\Neos\Service\UserService;
use TYPO3\Neos\Service\NodeTypeSchemaBuilder;
use TYPO3\Flow\Persistence\PersistenceManagerInterface;
use TYPO3\Neos\Service\LinkingService;
use TYPO3\Neos\Service\XliffService;
use TYPO3\Flow\I18n\Locale;

class BackendController extends ActionController
{

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
     * @var LinkingService
     */
    protected $linkingService;

    /**
     * @Flow\Inject
     * @var NodeTypeSchemaBuilder
     */
    protected $nodeTypeSchemaBuilder;

    /**
     * @Flow\Inject
     * @var XliffService
     */
    protected $xliffService;

    /**
     * Displays the backend interface
     *
     * @param NodeInterface $node The node that will be displayed on the first tab
     * @return void
     */
    public function indexAction(NodeInterface $node = null)
    {
        if($user = $this->userService->getBackendUser()) {
            if ($node === null) {
                $workspaceName = $this->userService->getPersonalWorkspaceName();
                $contentContext = $this->createContext($workspaceName);

                $contentContext->getWorkspace();
                $this->persistenceManager->persistAll();

                $node = $contentContext->getCurrentSiteNode();
            }

            $this->view->assign('initialState', json_encode([
                'user' => [
                    'name' => [
                        'title' => $user->getName()->getTitle(),
                        'firstName' => $user->getName()->getFirstName(),
                        'middleName' => $user->getName()->getMiddleName(),
                        'lastName' => $user->getName()->getLastName(),
                        'otherName' => $user->getName()->getOtherName(),
                        'fullName' => $user->getName()->getFullName()
                    ]
                ]
            ]));

            $this->view->assign('translations', $this->xliffService->getCachedJson(
                new Locale($this->userService->getInterfaceLanguage())
            ));

            $this->view->assign('documentNodeUri', $this->buildNodeUri($node));

            $this->view->assign('nodeTypeSchema', json_encode(
                $this->nodeTypeSchemaBuilder->generateNodeTypeSchema()
            ));
            return;
        }

        $this->redirectToUri($this->uriBuilder->uriFor('index', array(), 'Login', 'PackageFactory.Guevara'));
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

    /**
     * Build a node uri
     *
     * @return string
     */
    protected function buildNodeUri(NodeInterface $node) {
        return $this->linkingService->createNodeUri(
            $this->controllerContext,
            $node
        );
    }
}
