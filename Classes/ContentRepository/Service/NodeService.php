<?php
namespace Neos\Neos\Ui\ContentRepository\Service;

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
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\ContentRepository\Domain\Service\Context;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\ContentRepository\Domain\Utility\NodePaths;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Error\Messages\Error;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Model\Domain;
use Neos\Neos\Domain\Model\Site;
use Neos\Neos\Domain\Repository\DomainRepository;
use Neos\Neos\Domain\Repository\SiteRepository;

/**
 * @Flow\Scope("singleton")
 */
class NodeService
{
    /**
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contextFactory;

    /**
     * @Flow\Inject
     * @var SiteRepository
     */
    protected $siteRepository;

    /**
     * @Flow\Inject
     * @var DomainRepository
     */
    protected $domainRepository;

    /**
     * @var array<string, Context>
     */
    protected array $contextCache = [];

    /**
     * @Flow\InjectConfiguration(path="nodeTypeRoles.ignored", package="Neos.Neos.Ui")
     * @var string
     */
    protected $ignoredNodeTypeRole;

    /**
     * Helper method to retrieve the closest document for a node
     *
     * @param NodeInterface $node
     * @return NodeInterface
     */
    public function getClosestDocument(NodeInterface $node)
    {
        if ($node->getNodeType()->isOfType('Neos.Neos:Document')) {
            return $node;
        }

        $flowQuery = new FlowQuery([$node]);

        return $flowQuery->closest('[instanceof Neos.Neos:Document]')->get(0);
    }

    /**
     * Helper method to check if a given node is a document node.
     *
     * @param  NodeInterface $node The node to check
     * @return boolean             A boolean which indicates if the given node is a document node.
     */
    public function isDocument(NodeInterface $node)
    {
        return ($this->getClosestDocument($node) === $node);
    }

    /**
     * Converts a given context path to a node object
     *
     * @param string $contextPath
     * @return NodeInterface|Error
     */
    public function getNodeFromContextPath($contextPath, Site $site = null, Domain $domain = null, $includeAll = false)
    {
        $nodePathAndContext = NodePaths::explodeContextPath($contextPath);
        $nodePath = $nodePathAndContext['nodePath'];
        $workspaceName = $nodePathAndContext['workspaceName'];
        $dimensions = $nodePathAndContext['dimensions'];
        $siteNodeName = $site ? $site->getNodeName() : explode('/', $nodePath)[2];

        // Prevent reloading the same context multiple times
        $contextHash = md5(implode('|', [$siteNodeName, $workspaceName, json_encode($dimensions), $includeAll]));
        if (isset($this->contextCache[$contextHash])) {
            $context = $this->contextCache[$contextHash];
        } else {
            $contextProperties = $this->prepareContextProperties($workspaceName, $dimensions);

            if ($site === null) {
                $site = $this->siteRepository->findOneByNodeName($siteNodeName);
            }

            if ($domain === null) {
                $domain = $this->domainRepository->findOneBySite($site);
            }

            $contextProperties['currentSite'] = $site;
            $contextProperties['currentDomain'] = $domain;
            if ($includeAll === true) {
                $contextProperties['invisibleContentShown'] = true;
                $contextProperties['removedContentShown'] = true;
                $contextProperties['inaccessibleContentShown'] = true;
            }

            $context = $this->contextFactory->create(
                $contextProperties
            );

            $workspace = $context->getWorkspace(false);
            if (!$workspace) {
                return new Error(
                    sprintf('Could not convert the given source to Node object because the workspace "%s" as specified in the context node path does not exist.', $workspaceName),
                    1451392329
                );
            }
            $this->contextCache[$contextHash] = $context;
        }

        return $context->getNode($nodePath);
    }

    /**
     * Converts given context paths to a node objects
     *
     * @param string[] $nodeContextPaths
     * @return NodeInterface[]|Error
     */
    public function getNodesFromContextPaths(array $nodeContextPaths, Site $site = null, Domain $domain = null, $includeAll = false): array|Error
    {
        if (!$nodeContextPaths) {
            return [];
        }

        $nodePaths = array_map(static function($nodeContextPath) {
            return NodePaths::explodeContextPath($nodeContextPath)['nodePath'];
        }, $nodeContextPaths);

        $nodePathAndContext = NodePaths::explodeContextPath($nodeContextPaths[0]);
        $nodePath = $nodePathAndContext['nodePath'];
        $workspaceName = $nodePathAndContext['workspaceName'];
        $dimensions = $nodePathAndContext['dimensions'];
        $siteNodeName = explode('/', $nodePath)[2];
        $contextProperties = $this->prepareContextProperties($workspaceName, $dimensions);

        if ($site === null) {
            $site = $this->siteRepository->findOneByNodeName($siteNodeName);
        }

        if ($domain === null) {
            $domain = $this->domainRepository->findOneBySite($site);
        }

        $contextProperties['currentSite'] = $site;
        $contextProperties['currentDomain'] = $domain;
        if ($includeAll === true) {
            $contextProperties['invisibleContentShown'] = true;
            $contextProperties['removedContentShown'] = true;
            $contextProperties['inaccessibleContentShown'] = true;
        }
        $context = $this->contextFactory->create($contextProperties);

        $workspace = $context->getWorkspace(false);
        if (!$workspace) {
            return new Error(
                sprintf('Could not convert the given source to Node object because the workspace "%s" as specified in the context node path does not exist.', $workspaceName),
                1451392329
            );
        }

        // Query nodes and their variants from the database
        $queryBuilder = $this->entityManager->createQueryBuilder();
        $workspaces = $this->collectWorkspaceAndAllBaseWorkspaces($workspace);
        $workspacesNames = array_map(static function(Workspace $workspace) { return $workspace->getName(); }, $workspaces);

        // Filter by workspace and its parents
        $queryBuilder->select('n')
            ->from(NodeData::class, 'n')
            ->where('n.workspace IN (:workspaces)')
            ->andWhere('n.movedTo IS NULL')
            ->andWhere('n.path IN (:nodePaths)')
            ->setParameter('workspaces', $workspacesNames)
            ->setParameter('nodePaths', $nodePaths);
        $query = $queryBuilder->getQuery();
        $nodeDataWithVariants = $query->getResult();

        // Remove node duplicates
        $reducedNodeData = $this->reduceNodeVariantsByWorkspacesAndDimensions($nodeDataWithVariants, $workspaces, $dimensions);

        // Convert nodedata objects to nodes
        return array_reduce($reducedNodeData, function (array $carry, NodeData $nodeData) use ($context) {
            $node = $this->nodeFactory->createFromNodeData($nodeData, $context);
            if ($node !== null) {
                $carry[] = $node;
            }
            $context->getFirstLevelNodeCache()->setByPath($node->getPath(), $node);
            return $carry;
        }, []);
    }

    /**
     * @param NodeInterface[] $parentNodes
     */
    public function preloadChildNodesForNodes(array $parentNodes): void
    {
        if (empty($parentNodes)) {
            return;
        }

        $workspace = $parentNodes[0]->getWorkspace();
        $context = $parentNodes[0]->getContext();
        $dimensions = $context->getDimensions();

        $parentPaths = array_map(static function(NodeInterface $parentNode) {
            return $parentNode->getPath();
        }, $parentNodes);

        // Query nodes and their variants from the database
        $queryBuilder = $this->entityManager->createQueryBuilder();
        $workspaces = $this->collectWorkspaceAndAllBaseWorkspaces($workspace);
        $workspacesNames = array_map(static function(Workspace $workspace) { return $workspace->getName(); }, $workspaces);

        // Filter by workspace and its parents
        $queryBuilder->select('n')
            ->from(NodeData::class, 'n')
            ->where('n.workspace IN (:workspaces)')
            ->andWhere('n.movedTo IS NULL')
            ->andWhere('n.parentPath IN (:parentPaths)')
            ->setParameter('workspaces', $workspacesNames)
            ->setParameter('parentPaths', $parentPaths);
        $query = $queryBuilder->getQuery();
        $nodeDataWithVariants = $query->getResult();

        // Remove node duplicates
        $reducedNodeData = $this->reduceNodeVariantsByWorkspacesAndDimensions(
            $nodeDataWithVariants,
            $workspaces,
            $dimensions
        );

        // Convert nodedata objects to nodes and group them by parent path
        $childNodesByParentPath = array_reduce($reducedNodeData, function (array $carry, NodeData $nodeData) use ($context) {
            $node = $this->nodeFactory->createFromNodeData($nodeData, $context);
            if ($node !== null) {
                if (!isset($carry[$node->getParentPath()])) {
                    $carry[$node->getParentPath()] = [$node];
                } else {
                    $carry[$node->getParentPath()][] = $node;
                }
            }
            return $carry;
        }, []);

        foreach ($childNodesByParentPath as $parentPath => $childNodes) {
            usort($childNodes, static function(NodeInterface $a, NodeInterface $b) {
                return $a->getIndex() <=> $b->getIndex();
            });
            $context->getFirstLevelNodeCache()->setChildNodesByPathAndNodeTypeFilter(
                $parentPath, '!' .
                $this->ignoredNodeTypeRole,
                $childNodes
            );
        }
    }

    /**
     * Given an array with duplicate nodes (from different workspaces and dimensions) those are reduced to uniqueness (by node identifier)
     * Copied from Neos\ContentRepository\Domain\Repository\NodeDataRepository
     *
     * @param NodeData[] $nodes NodeData result with multiple and duplicate identifiers (different nodes and redundant results for node variants with different dimensions)
     * @param Workspace[] $workspaces
     * @param array $dimensions
     * @return NodeData[] Array of unique node results indexed by identifier
     */
    protected function reduceNodeVariantsByWorkspacesAndDimensions(array $nodes, array $workspaces, array $dimensions): array
    {
        $reducedNodes = [];

        $minimalDimensionPositionsByIdentifier = [];

        $workspaceNames = array_map(static fn (Workspace $workspace) => $workspace->getName(), $workspaces);

        foreach ($nodes as $node) {
            $nodeDimensions = $node->getDimensionValues();

            // Find the position of the workspace, a smaller value means more priority
            $workspacePosition = array_search($node->getWorkspace()->getName(), $workspaceNames);
            if ($workspacePosition === false) {
                throw new \Exception(sprintf(
                    'Node workspace "%s" not found in allowed workspaces (%s), this could result from a detached workspace entity in the context.',
                    $node->getWorkspace()->getName(),
                    implode(', ', $workspaceNames)
                ), 1718740117);
            }

            // Find positions in dimensions, add workspace in front for highest priority
            $dimensionPositions = [];

            // Special case for no dimensions
            if ($dimensions === []) {
                // We can just decide if the given node has no dimensions.
                $dimensionPositions[] = ($nodeDimensions === []) ? 0 : 1;
            }

            foreach ($dimensions as $dimensionName => $dimensionValues) {
                if (isset($nodeDimensions[$dimensionName])) {
                    foreach ($nodeDimensions[$dimensionName] as $nodeDimensionValue) {
                        $position = array_search($nodeDimensionValue, $dimensionValues);
                        if ($position === false) {
                            $position = PHP_INT_MAX;
                        }
                        $dimensionPositions[$dimensionName] = isset($dimensionPositions[$dimensionName]) ? min(
                            $dimensionPositions[$dimensionName],
                            $position
                        ) : $position;
                    }
                } else {
                    $dimensionPositions[$dimensionName] = isset($dimensionPositions[$dimensionName]) ? min(
                        $dimensionPositions[$dimensionName],
                        PHP_INT_MAX
                    ) : PHP_INT_MAX;
                }
            }
            $dimensionPositions[] = $workspacePosition;

            $identifier = $node->getIdentifier();
            // Yes, it seems to work comparing arrays that way!
            if (!isset($minimalDimensionPositionsByIdentifier[$identifier]) || $dimensionPositions < $minimalDimensionPositionsByIdentifier[$identifier]) {
                $reducedNodes[$identifier] = $node;
                $minimalDimensionPositionsByIdentifier[$identifier] = $dimensionPositions;
            }
        }

        return $reducedNodes;
    }

    /**
     * @return Workspace[]
     */
    protected function collectWorkspaceAndAllBaseWorkspaces(Workspace $workspace): array
    {
        $workspaces = [];
        while ($workspace !== null) {
            $workspaces[] = $workspace;
            $workspace = $workspace->getBaseWorkspace();
        }
        return $workspaces;
    }

    /**
     * Checks if the given node exists in the given workspace
     *
     * @param NodeInterface $node
     * @param Workspace $workspace
     * @return boolean
     */
    public function nodeExistsInWorkspace(NodeInterface $node, Workspace $workspace)
    {
        return $this->getNodeInWorkspace($node, $workspace) !== null;
    }

    /**
     * Get the variant of the given node in the given workspace
     *
     * @param NodeInterface $node
     * @param Workspace $workspace
     * @return NodeInterface|null
     */
    public function getNodeInWorkspace(NodeInterface $node, Workspace $workspace): ?NodeInterface
    {
        $context = ['workspaceName' => $workspace->getName()];
        $flowQuery = new FlowQuery([$node]);

        $result = $flowQuery->context($context);
        if ($result->count() > 0) {
            return $result->get(0);
        } else {
            return null;
        }
    }

    /**
     * Prepares the context properties for the nodes based on the given workspace and dimensions
     *
     * @param string $workspaceName
     * @param array $dimensions
     * @return array
     */
    protected function prepareContextProperties($workspaceName, array $dimensions = null)
    {
        $contextProperties = [
            'workspaceName' => $workspaceName,
            'invisibleContentShown' => false,
            'removedContentShown' => false
        ];

        if ($workspaceName !== 'live') {
            $contextProperties['invisibleContentShown'] = true;
        }

        if ($dimensions !== null) {
            $contextProperties['dimensions'] = $dimensions;
        }

        return $contextProperties;
    }
}
