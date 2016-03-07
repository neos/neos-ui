import {$get, $set} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

import {
    byNameSelector as nodeTypeByNameSelector,
    subTypesSelector
} from '../NodeTypes/';

const all = $get(['cr', 'nodes', 'byContextPath']);
const byContextPath = state => contextPath => $get(['cr', 'nodes', 'byContextPath', contextPath], state);
const focused = $get('cr.nodes.focused.contextPath');
const hovered = $get('cr.nodes.hovered.contextPath');

const resolveNode = (node, getNodeType) => {
    if (node) {
        const nodeType = getNodeType(node.nodeType);
        return $set('nodeType', {...nodeType, name: node.nodeType}, node);
    }

    return null;
};

const resolveNodeFromContextPath = (contextPath, byContextPath, getNodeType) => {
    const node = byContextPath(contextPath);
    return resolveNode(node, getNodeType);
};

export const focusedSelector = createSelector(
    [
        focused,
        byContextPath,
        nodeTypeByNameSelector
    ],
    resolveNodeFromContextPath
);

export const hoveredSelector = createSelector(
    [
        hovered,
        byContextPath,
        nodeTypeByNameSelector
    ],
    resolveNodeFromContextPath
);

export const byContextPathSelector = defaultMemoize(
    contextPath => createSelector(
        [
            () => contextPath,
            byContextPath,
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
        ).map(node => resolveNode(node, getNodeType))
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
