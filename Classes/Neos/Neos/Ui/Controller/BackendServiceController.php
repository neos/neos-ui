<?php
namespace Neos\Neos\Ui\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Neos.Neos.Ui".          *
 *                                                                        *
 *                                                                        */

use Neos\Neos\Ui\TypoScript\Helper\NodeInfoHelper;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\RequestInterface;
use Neos\Flow\Mvc\ResponseInterface;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Service\PublishingService;
use TYPO3\TYPO3CR\Domain\Repository\WorkspaceRepository;
use Neos\Neos\Ui\Domain\Model\ChangeCollection;
use Neos\Neos\Ui\Domain\Model\FeedbackCollection;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Error;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Info;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Success;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;
use Neos\Neos\Ui\Domain\Service\NodeTreeBuilder;
use Neos\Neos\Ui\TYPO3CR\Service\NodeService;
use Neos\Eel\FlowQuery\FlowQuery;

class BackendServiceController extends ActionController
{

    /**
     * @var array
     */
    protected $supportedMediaTypes = ['application/json'];

    /**
     * @var string
     */
    protected $defaultViewObjectName = \Neos\Flow\Mvc\View\JsonView::class;

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
     * @var WorkspaceRepository
     */
    protected $workspaceRepository;

    /**
     * Set the controller context on the feedback collection after the controller
     * has been initialized
     *
     * @param RequestInterface $request
     * @param ResponseInterface $response
     * @return void
     */
    public function initializeController(RequestInterface $request, ResponseInterface $response)
    {
        parent::initializeController($request, $response);
        $this->feedbackCollection->setControllerContext($this->getControllerContext());
    }

    /**
     * Helper method to inform the client, that new workspace information is available
     * @param string $documentNodeContextPath
     * @return void
     */
    protected function updateWorkspaceInfo($documentNodeContextPath)
    {
        $nodeService = new NodeService();
        $updateWorkspaceInfo = new UpdateWorkspaceInfo();
        $documnetNode = $this->nodeService->getNodeFromContextPath($documentNodeContextPath);
        $updateWorkspaceInfo->setDocument(
            $nodeService->getClosestDocument($documnetNode)
        );

        $this->feedbackCollection->add($updateWorkspaceInfo);
    }

    /**
     * Apply a set of changes to the system
     *
     * @param ChangeCollection $changes
     * @return void
     */
    public function changeAction(ChangeCollection $changes)
    {
        try {
            $count = $changes->count();
            $changes->compress()->apply();

            $success = new Info();
            $success->setMessage(sprintf('%d change(s) successfully applied.', $count));

            $this->feedbackCollection->add($success);
            $this->persistenceManager->persistAll();
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }

    /**
     * Publish nodes
     *
     * @param array $nodeContextPaths
     * @param string $targetWorkspaceName
     * @return void
     */
    public function publishAction(array $nodeContextPaths, $targetWorkspaceName)
    {
        try {
            $targetWorkspace = $this->workspaceRepository->findOneByName($targetWorkspaceName);

            foreach ($nodeContextPaths as $contextPath) {
                $node = $this->nodeService->getNodeFromContextPath($contextPath);
                $this->publishingService->publishNode($node, $targetWorkspace);
            }

            $success = new Success();
            $success->setMessage(sprintf('Published %d change(s) to %s.', count($nodeContextPaths),
                $targetWorkspaceName));

            $this->updateWorkspaceInfo($nodeContextPaths[0]);
            $this->feedbackCollection->add($success);

            $this->persistenceManager->persistAll();
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
     * @return void
     */
    public function discardAction(array $nodeContextPaths)
    {
        try {
            foreach ($nodeContextPaths as $contextPath) {
                $node = $this->nodeService->getNodeFromContextPath($contextPath);
                $this->publishingService->discardNode($node);

                $reloadDocument = new ReloadDocument();
                $reloadDocument->setDocument($this->nodeService->getClosestDocument($node));

                $this->feedbackCollection->add($reloadDocument);
            }

            $success = new Success();
            $success->setMessage(sprintf('Discarded %d node(s).', count($nodeContextPaths)));

            $this->updateWorkspaceInfo($nodeContextPaths[0]);
            $this->feedbackCollection->add($success);

            $this->persistenceManager->persistAll();
        } catch (\Exception $e) {
            $error = new Error();
            $error->setMessage($e->getMessage());

            $this->feedbackCollection->add($error);
        }

        $this->view->assign('value', $this->feedbackCollection);
    }

    public function initializeLoadTreeAction()
    {
        $this->arguments['nodeTreeArguments']->getPropertyMappingConfiguration()->allowAllProperties();
    }

    /**
     * Load the nodetree
     *
     * @param NodeTreeBuilder $nodeTreeArguments
     * @param boolean $includeRoot
     * @return void
     */
    public function loadTreeAction(NodeTreeBuilder $nodeTreeArguments, $includeRoot = false)
    {
        $nodeTreeArguments->setControllerContext($this->controllerContext);
        $this->view->assign('value', $nodeTreeArguments->build($includeRoot));
    }

    /**
     * Build and execute a flow query chain
     *
     * @param array $chain
     * @return void
     */
    public function flowQueryAction(array $chain)
    {
        $createContext = array_shift($chain);
        $finisher = array_pop($chain);

        $flowQuery = new FlowQuery(array_map(
            function ($envelope) {
                return $this->nodeService->getNodeFromContextPath($envelope['$node']);
            },
            $createContext['payload']
        ));

        foreach ($chain as $operation) {
            $flowQuery = call_user_func_array([$flowQuery, strtolower($operation['type'])], $operation['payload']);
        }

        if ('GET' === $finisher['type']) {
            $result = $flowQuery->get();
        }

        $nodeInfoHelper = new NodeInfoHelper();
        return json_encode($nodeInfoHelper->renderNodes($result, $this->getControllerContext()));
    }
}
