import {$get, $set} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';
import {Map} from 'immutable';

import {
    byNameSelector as nodeTypeByNameSelector,
    subTypesSelector
} from '../NodeTypes/index';

const all = $get(['cr', 'nodes', 'byContextPath']);
const focused = $get('cr.nodes.focused.contextPath');
const hovered = $get('cr.nodes.hovered.contextPath');

export const currentDocumentNode = $get('ui.contentCanvas.contextPath');

export const isDocumentNodeSelectedSelector = createSelector(
    [
        focused,
        currentDocumentNode
    ],
    (focused, currentDocumentNode) =>
        !focused || (focused === currentDocumentNode)
);

export const storedNodeByContextPath = state => contextPath => $get(['cr', 'nodes', 'byContextPath', contextPath], state);

// NOTE: in the longer run, it would be helpful to completely get rid of this method; and rather do it when ADDing nodes to the Redux store.
// However, this currently does not work because we'd need the NodeTypes to be initialized before we can add the first nodes to the store.
// HINT: The method currently does memoization, to ensure the results can be cached by Reselect (effectively greatly speeding up the UI).
const prepareStoredNodeForUsageCache = (new Map()).asMutable();
const prepareStoredNodeForUsage = (storedNode, getStoredNodeType) => {
    if (!prepareStoredNodeForUsageCache.get(storedNode)) {
        const nodeType = getStoredNodeType(storedNode.get('nodeType'));
        prepareStoredNodeForUsageCache.set(storedNode, $set('nodeType', nodeType.set('name', storedNode.get('nodeType')), storedNode));
    }

    return prepareStoredNodeForUsageCache.get(storedNode);
};

// NOTE: in the longer run, it would be helpful to completely get rid of this method and rather make the system behave well using immutable
// objects. The only thing this method does is calling prepareStoredNodeForUsage() and then calling .toJS() on the result.
// HINT: The method currently does memoization, to ensure the results can be cached by Reselect (effectively greatly speeding up the UI).
const resolveNodeFromContextPathCache = (new Map()).asMutable();
const resolveNodeFromContextPath = (contextPath, getStoredNodeByContextPath, getNodeType) => {
    const storedNode = getStoredNodeByContextPath(contextPath);

    const nodeForUsage = storedNode && prepareStoredNodeForUsage(storedNode, getNodeType);
    if (!nodeForUsage) {
        return null;
    }
    if (!resolveNodeFromContextPathCache.get(nodeForUsage)) {
        resolveNodeFromContextPathCache.set(nodeForUsage, nodeForUsage.toJS());
    }

    return resolveNodeFromContextPathCache.get(nodeForUsage);
};

export const focusedNodePathSelector = createSelector(
    [
        focused,
        currentDocumentNode
    ],
    (focused, currentDocumentNode) => {
        return focused || currentDocumentNode;
    }
);

export const focusedSelector = createSelector(
    [
        focusedNodePathSelector,
        storedNodeByContextPath,
        nodeTypeByNameSelector
    ],
    (focusedNodePath, storedNode, nodeType) =>
        resolveNodeFromContextPath(focusedNodePath, storedNode, nodeType)
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
        (nodes, nodeTypes, getNodeType) => nodes.filter(
            node => nodeTypes.contains($get('nodeType', node))
        ).map(node => prepareStoredNodeForUsage(node, getNodeType))
    )
);

export const isOfTypeSelector = defaultMemoize(
    nodeTypeName => contextPath => createSelector(
        [
            byContextPathSelector(contextPath),
            subTypesSelector(nodeTypeName)
        ],
        (node, nodeTypes) => nodeTypes.indexOf($get('nodeType.name', node)) !== -1
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
    byContextPathSelector(parentNodeContextPath(baseNode.contextPath))(state);

export const grandParentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath(parentNodeContextPath(baseNode.contextPath)))(state);
