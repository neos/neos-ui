<?php
namespace Neos\Neos\Ui\Domain\Dto;

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

class LoadTreeDto
{
    /**
     * The currently active node in the tree
     *
     * @var NodeInterface
     */
    protected $active;

    /**
     * An (optional) node type filter
     *
     * @var NodeType|null
     */
    protected $nodeTypeFilter = null;

    /**
     * An (optional) search term filter
     *
     * @var string
     */
    protected $searchTermFilter = '';

    /**
     * Determines how many levels of the tree should be loaded
     *
     * @var integer
     */
    protected $depth = 1;

    /**
     * Get the root node
     *
     * @return NodeInterface
     */
    public function getRoot()
    {
        return $this->active->geContext()->getCurrentSiteNode();
    }

    /**
     * Set the active node
     *
     * @param NodeInterface $active
     * @return void
     */
    public function setActive(NodeInterface $active)
    {
        $this->active = $active;
    }

    /**
     * Get the active node
     *
     * @return NodeInterface
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * Set the node type filter
     *
     * @param NodeType $nodeTypeFilter
     * @return void
     */
    public function setNodeTypeFilter(NodeType $nodeTypeFilter)
    {
        $this->nodeTypeFilter = $nodeTypeFilter;
    }

    /**
     * Get the node type filter
     *
     * @return NodeType|null
     */
    public function getNodeTypeFilter()
    {
        return $this->nodeTypeFilter;
    }

    /**
     * Set the search term filter
     *
     * @param string $searchTermFilter
     * @return void
     */
    public function setSearchTermFilter($searchTermFilter)
    {
        $this->searchTermFilter = $searchTermFilter;
    }

    /**
     * Get the search term filter
     *
     * @return string
     */
    public function getSearchTermFilter()
    {
        return $this->searchTermFilter;
    }

    /**
     * Set the depth
     *
     * @param integer $depth
     */
    public function setDepth($depth)
    {
        $this->depth = $depth;
    }

    /**
     * Get the depth
     *
     * @return integer
     */
    public function getDepth()
    {
        return $this->depth;
    }
}
