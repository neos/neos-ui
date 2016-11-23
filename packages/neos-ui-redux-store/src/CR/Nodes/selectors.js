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

// PERFORMANCE: This helper method is NOT allowed to post-process the retrieved node in any way;
// as we need to ensure the output is deterministic and can be cached for upstream selectors to
// work correctly.
//
// Instead of calling "node.toJS()" here (which totally breaks performance), we need to
// use the immutableNodeToJs() at the USAGE POINT of "nodeByContextPath", i.e.:
//
// nodeByContextPath (re-calculated at all times)
//    ---> focusedSelector (also re-calculated at all times, because nodeByContextPath changes for all invocations); but
//                         the RESULT of focusedSelector is "stable" again.
//    ---> immutableNodeToJs(focusedSelector): converts the focusedSelector result to plain JS; properly using memoization here.
const nodeByContextPath = state => contextPath =>
    $get(['cr', 'nodes', 'byContextPath', contextPath], state);

const immutableNodeToJs = selectorWhichEmitsNode =>
    createSelector(
        [
            selectorWhichEmitsNode
        ],
        node => {
            if (node && node.toJS) {
                node = node.toJS();
            }
            return node;
        }
    );

export const makeGetDocumentNodes = nodeTypesRegistry => createSelector(
    [
        nodes
    ],
    nodesMap => {
        const documentSubNodeTypes = nodeTypesRegistry.getSubTypesOf('TYPO3.Neos:Document');

        return nodesMap.filter(node => documentSubNodeTypes.includes(node.get('nodeType')));
    }
);

export const focusedNodePathSelector = immutableNodeToJs(createSelector(
    [
        focused,
        getCurrentContentCanvasContextPath
    ],
    (focused, currentContentCanvasContextPath) => {
        return focused || currentContentCanvasContextPath;
    }
));

export const focusedSelector = immutableNodeToJs(createSelector(
    [
        focusedNodePathSelector,
        nodeByContextPath
    ],
    (focusedNodePath, getNodeByContextPath) =>
        getNodeByContextPath(focusedNodePath)
));

export const hoveredSelector = immutableNodeToJs(createSelector(
    [
        hovered,
        nodeByContextPath
    ],
    (hoveredNodePath, getNodeByContextPath) =>
        getNodeByContextPath(hoveredNodePath)
));

export const byContextPathSelector = defaultMemoize(
    contextPath => immutableNodeToJs(createSelector(
        [
            nodeByContextPath
        ],
        getNodeByContextPath => getNodeByContextPath(contextPath)
    ))
);

export const parentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath(baseNode.contextPath))(state);

export const grandParentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath(parentNodeContextPath(baseNode.contextPath)))(state);
