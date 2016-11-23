<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeType;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\TYPO3CR\Domain\Service\NodeServiceInterface;
use TYPO3\TYPO3CR\Domain\Service\NodeTypeManager;
use Neos\Neos\Ui\Exception\InvalidNodeCreationHandlerException;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\ChangeInterface;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RenderNode;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

abstract class AbstractCreate extends AbstractChange
{
    /**
     * The type of the node that will be created
     *
     * @var NodeType
     */
    protected $nodeType;

    /**
     * The referenceData for the rendered node
     *
     * @var array
     */
    protected $referenceData = [];

    /**
     * @var NodeTypeManager
     * @Flow\Inject
     */
    protected $nodeTypeManager;

    /**
     * Incoming data from creationDialog
     *
     * @var array
     */
    protected $data = [];

    /**
     * An (optional) name that will be used for the new node path
     *
     * @var string|null
     */
    protected $name = null;

    /**
     * @Flow\Inject
     * @var NodeServiceInterface
     */
    protected $nodeService;

    /**
     * Get the insertion mode (before|after|into) that is represented by this change
     *
     * @return string
     */
    abstract public function getMode();

    /**
     * Set the node type
     *
     * @param string|NodeType $nodeType
     */
    public function setNodeType($nodeType)
    {
        if (is_string($nodeType)) {
            $nodeType = $this->nodeTypeManager->getNodeType($nodeType);
        }

        if (!$nodeType instanceof NodeType) {
            throw new \InvalidArgumentException('nodeType needs to be of type string or NodeType', 1452100970);
        }

        $this->nodeType = $nodeType;
    }

    /**
     * Get the node type
     *
     * @return NodeType
     */
    public function getNodeType()
    {
        return $this->nodeType;
    }


    /**
     * Set the referenceData
     *
     * @param array $referenceData
     * @return void
     */
    public function setReferenceData(array $referenceData)
    {
        $this->referenceData = $referenceData;
    }

    /**
     * Get the referenceData
     *
     * @return array
     */
    public function getReferenceData()
    {
        return $this->referenceData;
    }

    /**
     * Set the data
     *
     * @param array $data
     */
    public function setData(array $data)
    {
        $this->data = $data;
    }

    /**
     * Get the data
     *
     * @return array
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Set the name
     *
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * Get the name
     *
     * @return string|null
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Checks whether this change can be merged with a subsequent change
     *
     * @param  ChangeInterface $subsequentChange
     * @return boolean
     */
    public function canMerge(ChangeInterface $subsequentChange)
    {
        if (!$subsequentChange instanceof AbstractCreate) {
            return false;
        }

        if ($subsequentChange->getSubject() !== $this->getSubject()) {
            return false;
        }

        return $subsequentChange->canApply();
    }

    /**
     * Merges this change with a subsequent change
     *
     * @param  ChangeInterface $subsequentChange
     * @return void
     */
    public function merge(ChangeInterface $subsequentChange)
    {
        if ($this->canMerge($subsequentChange)) {
            return $subsequentChange;
        }
    }

    /**
     * Creates a new node beneath $parent
     *
     * @param  NodeInterface $parent
     * @return NodeInterface
     */
    protected function createNode(NodeInterface $parent)
    {
        $nodeType = $this->getNodeType();
        $name = $this->getName() ?: $this->nodeService->generateUniqueNodeName($parent->getPath());

        $node = $parent->createNode($name, $nodeType);

        $this->applyNodeCreationHandlers($node);

        if ($nodeType->isOfType('TYPO3.Neos:Content') && $this->getReferenceData()['subject']['fusionPath']) {
            $renderNode = new RenderNode();
            $renderNode->setNode($node);
            $renderNode->setReferenceData($this->getReferenceData());
            $renderNode->setMode($this->getMode());

            $this->feedbackCollection->add($renderNode);
        }

        $updateNodeInfo = new UpdateNodeInfo();
        $updateNodeInfo->setNode($node);

        $this->feedbackCollection->add($updateNodeInfo);

        return $node;
    }

    /**
     * Apply nodeCreationHandlers
     *
     * @param NodeInterface $node
     * @throws InvalidNodeCreationHandlerException
     * @return void
     */
    protected function applyNodeCreationHandlers(NodeInterface $node) {
        $data = $this->getData() ?: [];
        $nodeType = $node->getNodeType();
        if (isset($nodeType->getOptions()['nodeCreationHandlers'])) {
            $nodeCreationHandlers = $nodeType->getOptions()['nodeCreationHandlers'];
            if (is_array($nodeCreationHandlers)) {
                foreach($nodeCreationHandlers as $nodeCreationHandlerConfiguration) {
                    $nodeCreationHandler = new $nodeCreationHandlerConfiguration['nodeCreationHandler']();
                    if (!$nodeCreationHandler instanceof NodeCreationHandlerInterface) {
                        throw new InvalidNodeCreationHandlerException(sprintf('Expected NodeCreationHandlerInterface but got "%s"', get_class($nodeCreationHandler)), 1364759956);
                    }
                    $nodeCreationHandler->handle($node, $data);
                }
            }
        }
    }
}
