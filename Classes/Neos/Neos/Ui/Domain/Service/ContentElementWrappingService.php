<?php
namespace Neos\Neos\Ui\Domain\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentGraph\DoctrineDbalAdapter\Domain\Repository\ContentSubgraph;
use Neos\ContentRepository\Domain\Context\ContentStream\ContentStreamIdentifier;
use Neos\ContentRepository\Domain\Projection\Content\ContentSubgraphInterface;
use Neos\ContentRepository\Domain\Projection\Content\NodeInterface;
use Neos\ContentRepository\Domain\Projection\Workspace\WorkspaceFinder;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Session\SessionInterface;
use Neos\Neos\Domain\Context\Content\NodeAddress;
use Neos\Neos\Domain\Context\Content\NodeAddressFactory;
use Neos\Neos\Service\ContentElementWrappingServiceInterface;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\Mapping\NodePropertyConverterService;
use Neos\ContentRepository\Service\AuthorizationService;
use Neos\Fusion\Service\HtmlAugmenter as FusionHtmlAugmenter;

/**
 * The content element wrapping service adds the necessary markup around
 * a content element such that it can be edited using the Content Module
 * of the Neos Backend.
 *
 * @Flow\Scope("singleton")
 */
class ContentElementWrappingService implements ContentElementWrappingServiceInterface
{
    /**
     * @Flow\Inject
     * @var PrivilegeManagerInterface
     */
    protected $privilegeManager;

    /**
     * @Flow\Inject
     * @var AuthorizationService
     */
    protected $nodeAuthorizationService;

    /**
     * @Flow\Inject
     * @var FusionHtmlAugmenter
     */
    protected $htmlAugmenter;

    /**
     * @Flow\Inject
     * @var NodePropertyConverterService
     */
    protected $nodePropertyConverterService;


    /**
     * @Flow\Inject
     * @var SessionInterface
     */
    protected $session;

    /**
     * @Flow\Inject
     * @var WorkspaceFinder
     */
    protected $workspaceFinder;

    /**
     * @Flow\Inject
     * @var UserLocaleService
     */
    protected $userLocaleService;

    /**
     * @Flow\Inject
     * @var NodeInfoHelper
     */
    protected $nodeInfoHelper;


    /**
     * All editable nodes rendered in the document
     *
     * @var array
     */
    protected $renderedNodes = [];


    /**
     * String containing `<script>` tags for non rendered nodes
     *
     * @var string
     */
    protected $nonRenderedContentNodeMetadata;

    /**
     * @Flow\Inject
     * @var NodeAddressFactory
     */
    protected $nodeAddressFactory;

    /**
     * Wrap the $content identified by $node with the needed markup for the backend.
     *
     * @param NodeInterface $node
     * @param ContentSubgraphInterface $subgraph
     * @param string $content
     * @param string $fusionPath
     * @return string
     * @throws \Neos\Eel\Exception
     */
    public function wrapContentObject(NodeInterface $node, ContentSubgraphInterface $subgraph, $content, $fusionPath): string
    {
        if ($this->isContentStreamOfLiveWorkspace($subgraph->getContentStreamIdentifier())) {
            return $content;
        }


        // TODO: reenable permissions
        //if ($this->nodeAuthorizationService->isGrantedToEditNode($node) === false) {
        //    return $content;
        //}

        $attributes = [
            'data-__neos-node-contextpath' => $this->nodeAddressFactory->createFromNode($node)->serializeForUri(),
            'data-__neos-fusion-path' => $fusionPath
        ];

        $this->renderedNodes[(string)$node->getNodeIdentifier()] = $node;

        $this->userLocaleService->switchToUILocale();

        $serializedNode = json_encode($this->nodeInfoHelper->renderNode($node, $subgraph));

        $this->userLocaleService->switchToUILocale(true);

        $wrappedContent = $this->htmlAugmenter->addAttributes($content, $attributes, 'div');
        $nodeContextPath = $this->nodeAddressFactory->createFromNode($node)->serializeForUri();
        $wrappedContent .= "<script data-neos-nodedata>(function(){(this['@Neos.Neos.Ui:Nodes'] = this['@Neos.Neos.Ui:Nodes'] || {})['{$nodeContextPath}'] = {$serializedNode}})()</script>";

        return $wrappedContent;
    }

    /**
     * Concatenate strings containing `<script>` tags for all child nodes not rendered
     * within the current document node. This way we can show e.g. content collections
     * within the structure tree which are not actually rendered.
     *
     * @param NodeInterface $documentNode
     * @param ContentSubgraphInterface $subgraph
     * @return mixed
     * @throws \Neos\Eel\Exception
     */
    protected function appendNonRenderedContentNodeMetadata(NodeInterface $documentNode, ContentSubgraphInterface $subgraph)
    {
        if ($this->isContentStreamOfLiveWorkspace($subgraph->getContentStreamIdentifier())) {
            return '';
        }


        foreach ($subgraph->findChildNodes($documentNode->getNodeIdentifier()) as $node) {
            if ($node->getNodeType()->isOfType('Neos.Neos:Document') === true) {
                continue;
            }

            if (isset($this->renderedNodes[(string)$node->getNodeIdentifier()]) === false) {
                $serializedNode = json_encode($this->nodeInfoHelper->renderNode($node, $subgraph));
                $nodeContextPath = $this->nodeAddressFactory->createFromNode($node)->serializeForUri();
                $this->nonRenderedContentNodeMetadata .= "<script>(function(){(this['@Neos.Neos.Ui:Nodes'] = this['@Neos.Neos.Ui:Nodes'] || {})['{$nodeContextPath}'] = {$serializedNode}})()</script>";
            }

            if ($subgraph->countChildNodes($node->getNodeIdentifier()) > 0) {
                $this->nonRenderedContentNodeMetadata .= $this->appendNonRenderedContentNodeMetadata($node, $subgraph);
            }
        }
    }

    /**
     * Clear rendered nodes helper array to prevent possible side effects.
     */
    protected function clearRenderedNodesArray()
    {
        $this->renderedNodes = [];
    }

    /**
     * Clear non rendered content node metadata to prevent possible side effects.
     */
    protected function clearNonRenderedContentNodeMetadata()
    {
        $this->nonRenderedContentNodeMetadata = '';
    }

    /**
     * @param NodeInterface $documentNode
     * @param ContentSubgraphInterface $subgraph
     * @return string
     * @throws \Neos\Eel\Exception
     */
    public function getNonRenderedContentNodeMetadata(NodeInterface $documentNode, ContentSubgraphInterface $subgraph)
    {
        $this->userLocaleService->switchToUILocale();

        $this->appendNonRenderedContentNodeMetadata($documentNode, $subgraph);
        $nonRenderedContentNodeMetadata = $this->nonRenderedContentNodeMetadata;
        $this->clearNonRenderedContentNodeMetadata();
        $this->clearRenderedNodesArray();

        $this->userLocaleService->switchToUILocale(true);

        return $nonRenderedContentNodeMetadata;
    }

    private function isContentStreamOfLiveWorkspace(ContentStreamIdentifier $contentStreamIdentifier)
    {
        return $this->workspaceFinder->findOneByCurrentContentStreamIdentifier($contentStreamIdentifier)->getWorkspaceName()->isLive();
    }

    public function wrapCurrentDocumentMetadata(NodeInterface $node, ContentSubgraphInterface $subgraph, $content, $fusionPath, array $additionalAttributes = []): string {
        // we do not need to implement this for the new UI
        return $content;
    }
}
