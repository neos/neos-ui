import {$get} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

import {getCurrentContentCanvasContextPath} from './../../UI/ContentCanvas/selectors';

import {getAllowedNodeTypesTakingAutoCreatedIntoAccount} from './helpers';

const nodes = $get(['cr', 'nodes', 'byContextPath']);
const focused = $get('cr.nodes.focused.contextPath');

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
export const nodeByContextPath = state => contextPath =>
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
        const documentSubNodeTypes = nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('document'));

        return nodesMap.filter(node => documentSubNodeTypes.includes(node.get('nodeType')));
    }
);

export const makeHasChildrenSelector = allowedNodeTypes => createSelector(
    [
        (state, contextPath) => $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state)
    ],
    childNodeEnvelopes => childNodeEnvelopes.some(
        childNodeEnvelope => allowedNodeTypes.includes($get('nodeType', childNodeEnvelope))
    )
);

export const makeChildrenOfSelector = allowedNodeTypes => createSelector(
    [
        (state, contextPath) => $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state),
        $get('cr.nodes.byContextPath')
    ],
    (childNodeEnvelopes, nodesByContextPath) => childNodeEnvelopes
    .filter(
        childNodeEnvelope => allowedNodeTypes.includes($get('nodeType', childNodeEnvelope))
    )
    .map(
        $get('contextPath')
    )
    .map(
        contextPath => $get(contextPath, nodesByContextPath)
    )
);

export const siteNodeSelector = createSelector(
    [
        $get('cr.nodes.siteNode'),
        $get('cr.nodes.byContextPath')
    ],
    (siteNodeContextPath, nodesByContextPath) => $get(siteNodeContextPath, nodesByContextPath)
);

export const byContextPathSelector = defaultMemoize(
    contextPath => immutableNodeToJs(createSelector(
        [
            nodeByContextPath
        ],
        getNodeByContextPath => getNodeByContextPath(contextPath)
    ))
);

export const parentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath($get('contextPath', baseNode)))(state);

export const grandParentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath(parentNodeContextPath($get('contextPath', baseNode))))(state);

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

export const focusedParentSelector = createSelector(
    [
        focusedSelector,
        state => state
    ],
    (focusedNode, state) => {
        if (!focusedNode) {
            return undefined;
        }

        return parentNodeSelector(state)(focusedNode);
    }
);

export const focusedGrandParentSelector = createSelector(
    [
        focusedParentSelector,
        state => state
    ],
    (focusedParentNode, state) => {
        if (!focusedParentNode) {
            return undefined;
        }

        return parentNodeSelector(state)(focusedParentNode);
    }
);

/**
 * This selector returns a function which you need to pass in the node-Type-Registry
 */
export const getAllowedSiblingNodeTypesForFocusedNodeSelector = createSelector(
    [
        focusedSelector,
        focusedParentSelector,
        focusedGrandParentSelector
    ],
    (focusedNode, focusedNodeParent, focusedNodeGrandParent) =>
        defaultMemoize(nodeTypesRegistry => {
            if (!focusedNode) {
                return [];
            }

            return getAllowedNodeTypesTakingAutoCreatedIntoAccount(
                focusedNodeParent,
                focusedNodeGrandParent,
                nodeTypesRegistry
            );
        })
);

export const clipboardNodeContextPathSelector = createSelector(
    [
        $get('cr.nodes.clipboard')
    ],
    clipboardNodeContextPath => clipboardNodeContextPath
);

export const clipboardIsEmptySelector = createSelector(
    [
        $get('cr.nodes.clipboard')
    ],
    clipboardNodePath => Boolean(clipboardNodePath)
);

export const canBePastedAlongsideSelector = createSelector(
    [
        nodeByContextPath,
        parentNodeSelector,
        grandParentNodeSelector
    ],
    (getNodeByContextPath, getParentNode, getGrandParentNode) =>
        (subjectContextPath, referenceContextPath, nodeTypesRegistry) => {
            const subject = getNodeByContextPath(subjectContextPath);
            const reference = getNodeByContextPath(referenceContextPath);
            const referenceParent = getParentNode(reference);
            const referenceGrandParent = getGrandParentNode(reference);
            const allowedNodeTypes = getAllowedNodeTypesTakingAutoCreatedIntoAccount(
                referenceParent,
                referenceGrandParent,
                nodeTypesRegistry
            );

            return allowedNodeTypes.indexOf($get('nodeType', subject)) !== -1;
        }
);

export const canBePastedIntoSelector = createSelector(
    [
        nodeByContextPath,
        parentNodeSelector
    ],
    (getNodeByContextPath, getParentNode) =>
        (subjectContextPath, referenceContextPath, nodeTypesRegistry) => {
            const subject = getNodeByContextPath(subjectContextPath);
            const reference = getNodeByContextPath(referenceContextPath);
            const referenceParent = getParentNode(reference);
            const allowedNodeTypes = getAllowedNodeTypesTakingAutoCreatedIntoAccount(
                reference,
                referenceParent,
                nodeTypesRegistry
            );

            return allowedNodeTypes.indexOf($get('nodeType', subject)) !== -1;
        }
);

export const canBePastedSelector = createSelector(
    [
        canBePastedAlongsideSelector,
        canBePastedIntoSelector
    ],
    (canBePastedAlongside, canBePastedInto) =>
        (...args) => canBePastedAlongside(...args) || canBePastedInto(...args)

);
