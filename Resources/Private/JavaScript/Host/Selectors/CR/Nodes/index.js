import {$get, $set} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

import {
    byNameSelector as nodeTypeByNameSelector,
    subTypesSelector
} from '../NodeTypes/';

const all = $get(['cr', 'nodes', 'byContextPath']);
const storedNodeByContextPath = state => contextPath => $get(['cr', 'nodes', 'byContextPath', contextPath], state);
const focused = $get('cr.nodes.focused.contextPath');
const hovered = $get('cr.nodes.hovered.contextPath');

// Implementation detail of resolveNodeFromContextPath, which enriches a stored node and makes it a "node" ready for usage to the outside.
const prepareStoredNodeForUsage = (storedNode, getStoredNodeType) => {
    if (storedNode) {
        const nodeType = getStoredNodeType(storedNode.nodeType);
        return $set('nodeType', {...nodeType, name: storedNode.nodeType}, storedNode);
    }

    return null;
};

const resolveNodeFromContextPath = (contextPath, getStoredNodeByContextPath, getNodeType) => {
    const node = getStoredNodeByContextPath(contextPath);
    return prepareStoredNodeForUsage(node, getNodeType);
};

export const focusedSelector = createSelector(
    [
        focused,
        storedNodeByContextPath,
        nodeTypeByNameSelector
    ],
    resolveNodeFromContextPath
);

export const hoveredSelector = createSelector(
    [
        hovered,
        storedNodeByContextPath,
        nodeTypeByNameSelector
    ],
    resolveNodeFromContextPath
);

export const byContextPathSelector = defaultMemoize(
    contextPath => createSelector(
        [
            () => contextPath,
            storedNodeByContextPath,
            nodeTypeByNameSelector
        ],
        resolveNodeFromContextPath
    )
);

export const byNodeTypeSelector = defaultMemoize(
    nodeTypeName => createSelector(
        [
            all,
            subTypesSelector(nodeTypeName),
            nodeTypeByNameSelector
        ],
        (nodes, nodeTypes, getNodeType) => Object.keys(nodes).map(k => nodes[k]).filter(
            node => nodeTypes.indexOf(node.nodeType) !== -1
        ).map(node => prepareStoredNodeForUsage(node, getNodeType))
    )
);

export const isOfTypeSelector = defaultMemoize(
    nodeTypeName => contextPath => createSelector(
        [
            byContextPathSelector(contextPath),
            subTypesSelector(nodeTypeName)
        ],
        (node, nodeTypes) => nodeTypes.indexOf(node.nodeType.name) !== -1
    )
);
