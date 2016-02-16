<?php
namespace PackageFactory\Guevara\Domain\Model\Changes;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeType;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\TYPO3CR\Utility as NodeUtility;
use TYPO3\TYPO3CR\Domain\Service\NodeServiceInterface;
use TYPO3\TYPO3CR\Domain\Service\NodeTypeManager;
use PackageFactory\Guevara\Domain\Model\AbstractChange;
use PackageFactory\Guevara\Domain\Model\ChangeInterface;

abstract class AbstractCreate extends AbstractChange
{
    /**
     * The type of the node that will be created
     *
     * @var NodeType
     */
    protected $nodeType;

    /**
     * A set of properties, that will be saved with the new node
     *
     * @var array
     */
    protected $initialProperties = [];

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
     * @var NodeTypeManager
     * @Flow\Inject
     */
    protected $nodeTypeManager;

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
     * Set the initial properties
     *
     * @param array $initialProperties
     */
    public function setInitialProperties(array $initialProperties)
    {
        $this->initialProperties = $initialProperties;
    }

    /**
     * Get the initial properties
     *
     * @return array
     */
    public function getInitialProperties()
    {
        return $this->initialProperties;
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
        $initialProperties = $this->getInitialProperties();
        $name = $this->getName() ?: $this->nodeService->generateUniqueNodeName($parent->getPath());

        //
        // If we're about to create a document, check for the presence of the uriPathSegment property first
        // and create it, if it's missing
        //
        if ($nodeType->isOfType('TYPO3.Neos:Document') && !isset($initialProperties['uriPathSegment'])) {
            if (!isset($initialProperties['title'])) {
                throw new \IllegalArgumentException(
                  'You must either provide a title or a uriPathSegment in order to create a document.', 1452103891);
            }

            $initialProperties['uriPathSegment'] = NodeUtility::renderValidNodeName($initialProperties['title']);
        }

        $node = $parent->createNode($name, $nodeType);

        foreach ($initialProperties as $key => $value) {
            $node->setProperty($key, $value);
        }

        return $node;
    }
}
