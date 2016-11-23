import {$get} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';
import {getCurrentContentCanvasContextPath} from './../../UI/ContentCanvas/selectors';

const nodes = $get(['cr', 'nodes', 'byContextPath']);
const focused = $get('cr.nodes.focused.contextPath');
const hovered = $get('cr.nodes.hovered.contextPath');

const parentNodeContextPath = contextPath => {
    if (typeof contextPath !== 'string') {
        return null;
    }

    const [path, context] = contextPath.split('@');

    return `${path.substr(0, path.lastIndexOf('/'))}@${context}`;
};

export const isDocumentNodeSelectedSelector = createSelector(
    [
        focused,
        getCurrentContentCanvasContextPath
    ],
    (focused, currentContentCanvasContextPath) => {
        return !focused || (focused === currentContentCanvasContextPath);
    }
);

export const nodeByContextPath = state => contextPath => {
    const node = $get(['cr', 'nodes', 'byContextPath', contextPath], state);

    if (node && node.toJS) {
        return node.toJS();
    }

    return node;
};

export const makeGetDocumentNodes = nodeTypesRegistry => createSelector(
    [
        nodes
    ],
    nodesMap => {
        const documentSubNodeTypes = nodeTypesRegistry.getSubTypesOf('TYPO3.Neos:Document');

        return nodesMap.filter(node => documentSubNodeTypes.includes(node.get('nodeType')));
    }
);

export const focusedNodePathSelector = createSelector(
    [
        focused,
        getCurrentContentCanvasContextPath
    ],
    (focused, currentContentCanvasContextPath) => {
        return focused || currentContentCanvasContextPath;
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

export const parentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath(baseNode.contextPath))(state);

export const grandParentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath(parentNodeContextPath(baseNode.contextPath)))(state);
