import {$get, $set} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

import {
    byNameSelector as nodeTypeByNameSelector,
    subTypesSelector
} from '../NodeTypes/';

const all = $get(['cr', 'nodes', 'byContextPath']);
const focused = $get('cr.nodes.focused.contextPath');
const currentDocumentNode = $get('ui.contentView.contextPath');
const hovered = $get('cr.nodes.hovered.contextPath');

export const storedNodeByContextPath = state => contextPath => $get(['cr', 'nodes', 'byContextPath', contextPath], state);

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
        currentDocumentNode,
        storedNodeByContextPath,
        nodeTypeByNameSelector
    ],
    (focused, currentDocumentNode, storedNode, nodeType) =>
        resolveNodeFromContextPath(focused || currentDocumentNode, storedNode, nodeType)
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

const parentNodeContextPath = contextPath => {
    if (typeof contextPath !== 'string') {
        return null;
    }
    const [path, context] = contextPath.split('@');
    return `${path.substr(0, path.lastIndexOf('/'))}@${context}`;
};

export const parentNodeSelector = state => baseNode =>
    storedNodeByContextPath(state)(parentNodeContextPath(baseNode.contextPath));

export const grandParentNodeSelector = state => baseNode =>
    storedNodeByContextPath(state)(parentNodeContextPath(parentNodeContextPath(baseNode.contextPath)));
