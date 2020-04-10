<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

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
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\Service\NodeServiceInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\ContentRepository\Exception\NodeTypeNotFoundException;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadContentOutOfBand;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;
use Neos\Neos\Ui\Service\NodePropertyValidationService;
use Neos\Utility\ObjectAccess;

/**
 * Changes a property on a node
 */
class Property extends AbstractChange
{

    /**
     * @Flow\Inject
     * @var NodePropertyConversionService
     */
    protected $nodePropertyConversionService;

    /**
     * @Flow\Inject
     * @var NodePropertyValidationService
     */
    protected $nodePropertyValidationService;

    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * @Flow\Inject
     * @var NodeServiceInterface
     */
    protected $nodeService;

    /**
     * The node dom address
     *
     * @var RenderedNodeDomAddress
     */
    protected $nodeDomAddress;

    /**
     * The name of the property to be changed
     *
     * @var string
     */
    protected $propertyName;

    /**
     * The value, the property will be set to
     *
     * @var string
     */
    protected $value;

    /**
     * The change has been initiated from the inline editing
     *
     * @var bool
     */
    protected $isInline;

    /**
     * Set the property name
     *
     * @param string $propertyName
     * @return void
     */
    public function setPropertyName($propertyName)
    {
        $this->propertyName = $propertyName;
    }

    /**
     * Get the property name
     *
     * @return string
     */
    public function getPropertyName()
    {
        return $this->propertyName;
    }

    /**
     * Set the node dom address
     *
     * @param RenderedNodeDomAddress $nodeDomAddress
     * @return void
     */
    public function setNodeDomAddress(RenderedNodeDomAddress $nodeDomAddress = null)
    {
        $this->nodeDomAddress = $nodeDomAddress;
    }

    /**
     * Get the node dom address
     *
     * @return RenderedNodeDomAddress
     */
    public function getNodeDomAddress()
    {
        return $this->nodeDomAddress;
    }

    /**
     * Set the value
     *
     * @param string $value
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * Get the value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Set isInline
     *
     * @param bool $isInline
     */
    public function setIsInline($isInline)
    {
        $this->isInline = $isInline;
    }

    /**
     * Get isInline
     *
     * @return bool
     */
    public function getIsInline()
    {
        return $this->isInline;
    }

    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply()
    {
        $nodeType = $this->getSubject()->getNodeType();
        $propertyName = $this->getPropertyName();
        $nodeTypeProperties = $nodeType->getProperties();

        if (!isset($nodeTypeProperties[$propertyName])) {
            return false;
        }

        if (isset($nodeTypeProperties[$propertyName]['validation'])) {
            foreach ($nodeTypeProperties[$propertyName]['validation'] as $validatorName => $validatorConfiguration) {
                if (!\is_array($validatorConfiguration)) {
                    $validatorConfiguration = [];
                }
                if ($this->nodePropertyValidationService->validate($this->value, $validatorName, $validatorConfiguration) === false) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Applies this change
     *
     * @return void
     * @throws NodeTypeNotFoundException
     */
    public function apply()
    {
        if ($this->canApply()) {
            $node = $this->getSubject();
            $propertyName = $this->getPropertyName();
            $value = $this->nodePropertyConversionService->convert(
                $node->getNodeType(),
                $propertyName,
                $this->getValue(),
                $node->getContext()
            );

            // TODO: Make changing the node type a separated, specific/defined change operation.
            if ($propertyName === '_nodeType') {
                $nodeType = $this->nodeTypeManager->getNodeType($value);
                $node = $this->changeNodeType($node, $nodeType);
            } elseif ($propertyName[0] === '_') {
                ObjectAccess::setProperty($node, substr($propertyName, 1), $value);
            } else {
                $node->setProperty($propertyName, $value);
            }

            $this->updateWorkspaceInfo();

            $reloadIfChangedConfigurationPath = sprintf('properties.%s.ui.reloadIfChanged', $propertyName);
            if (!$this->getIsInline() && $node->getNodeType()->getConfiguration($reloadIfChangedConfigurationPath)) {
                if ($this->getNodeDomAddress() && $this->getNodeDomAddress()->getFusionPath()
                    && $node->getNodeType()->isOfType('Neos.Neos:Content')
                    && $node->getParent()->getNodeType()->isOfType('Neos.Neos:ContentCollection')
                ) {
                    $reloadContentOutOfBand = new ReloadContentOutOfBand();
                    $reloadContentOutOfBand->setNode($node);
                    $reloadContentOutOfBand->setNodeDomAddress($this->getNodeDomAddress());
                    $this->feedbackCollection->add($reloadContentOutOfBand);
                } else {
                    // To prevent a full document reload we try to find a ContentCollection in the list of parents
                    // which would allows us to reload its children. Then we request a reload on the child that is
                    // a parent of our modified node.
                    $closestCollectionChildNode = $node;
                    while ($closestCollectionChildNode->getParent()
                        && !($closestCollectionChildNode->getParent()->getNodeType()->isOfType('Neos.Neos:ContentCollection')
                            || $closestCollectionChildNode->getParent()->getNodeType()->isOfType('Neos.Neos:Document'))) {
                        $closestCollectionChildNode = $closestCollectionChildNode->getParent();
                    }
                    if ($closestCollectionChildNode && $closestCollectionChildNode->getParent() && $closestCollectionChildNode->getParent()->getNodeType()->isOfType('Neos.Neos:ContentCollection')) {
                        $fusionContextNodeTypeTag = '<' . $closestCollectionChildNode->getNodeType() . '>';

                        // Traverse to the fusion path that matches the tag of the closest node we can reload
                        $closestCollectionChildNodeFusionPath = explode('/', $this->getNodeDomAddress()->getFusionPath());
                        for ($i = count($closestCollectionChildNodeFusionPath) - 1; $i >= 0; $i--) {
                            if (strpos($closestCollectionChildNodeFusionPath[$i], $fusionContextNodeTypeTag) === false) {
                                array_pop($closestCollectionChildNodeFusionPath);
                            } else {
                                break;
                            }
                        }

                        $reloadContentOutOfBand = new ReloadContentOutOfBand();
                        $reloadContentOutOfBand->setNode($closestCollectionChildNode);
                        $parentNodeDomAddress = new RenderedNodeDomAddress();
                        $parentNodeDomAddress->setContextPath($closestCollectionChildNode->getContextPath());
                        $parentNodeDomAddress->setFusionPath(join('/', $closestCollectionChildNodeFusionPath));
                        $reloadContentOutOfBand->setNodeDomAddress($parentNodeDomAddress);
                        $this->feedbackCollection->add($reloadContentOutOfBand);
                    } else {
                        $this->reloadDocument($node);
                    }
                }
            }

            $reloadPageIfChangedConfigurationPath = sprintf('properties.%s.ui.reloadPageIfChanged', $propertyName);
            if (!$this->getIsInline() && $node->getNodeType()->getConfiguration($reloadPageIfChangedConfigurationPath)) {
                $this->reloadDocument($node);
            }

            // This might be needed to update node label and other things that we can calculate only on the server
            $updateNodeInfo = new UpdateNodeInfo();
            $updateNodeInfo->setNode($node);
            $this->feedbackCollection->add($updateNodeInfo);
        }
    }

    /**
     * @param NodeInterface $node
     * @param NodeType $nodeType
     * @return NodeInterface
     */
    protected function changeNodeType(NodeInterface $node, NodeType $nodeType)
    {
        $oldNodeType = $node->getNodeType();
        ObjectAccess::setProperty($node, 'nodeType', $nodeType);
        $this->nodeService->cleanUpProperties($node);
        $this->nodeService->cleanUpAutoCreatedChildNodes($node, $oldNodeType);
        $this->nodeService->createChildNodes($node);

        return $node;
    }
}
