import {$get, $set} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';
import {Map} from 'immutable';

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

export const nodeByContextPath = state => contextPath => {
    const node = $get(['cr', 'nodes', 'byContextPath', contextPath], state);

    if (node && node.toJS) {
        return node.toJS();
    }

    return node;
}

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
        nodeByContextPath
    ],
    (focusedNodePath, getNodeByContextPath) =>
        getNodeByContextPath(focusedNodePath)
);

export const hoveredSelector = createSelector(
    [
        hovered,
        nodeByContextPath
    ],
    (hoveredNodePath, getNodeByContextPath) =>
        getNodeByContextPath(hoveredNodePath)
);

export const byContextPathSelector = defaultMemoize(
    contextPath => createSelector(
        [
            nodeByContextPath
        ],
        getNodeByContextPath => getNodeByContextPath(contextPath)
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
