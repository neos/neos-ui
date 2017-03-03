import {$get} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

import {getCurrentContentCanvasContextPath} from './../../UI/ContentCanvas/selectors';

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

export const makeGetDocumentNodes = nodeTypesRegistry => createSelector(
    [
        nodes
    ],
    nodesMap => {
        const documentSubNodeTypes = nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('document'));

        return nodesMap.filter(node => documentSubNodeTypes.includes(node.get('nodeType')));
    }
);

export const makeGetNodeByContextPathSelector = () => createSelector(
    [
        (state, contextPath) => $get(['cr', 'nodes', 'byContextPath', contextPath], state)
    ],
    node => node
);

export const makeHasChildrenSelector = allowedNodeTypes => createSelector(
    [
        (state, contextPath) => $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state)
    ],
    childNodeEnvelopes => (childNodeEnvelopes || []).some(
        childNodeEnvelope => allowedNodeTypes.includes($get('nodeType', childNodeEnvelope))
    )
);

export const makeChildrenOfSelector = allowedNodeTypes => createSelector(
    [
        (state, contextPath) => $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state),
        $get('cr.nodes.byContextPath')
    ],
    (childNodeEnvelopes, nodesByContextPath) => (childNodeEnvelopes || [])
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
    contextPath => createSelector(
        [
            nodeByContextPath
        ],
        getNodeByContextPath => getNodeByContextPath(contextPath)
    )
);

export const parentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath($get('contextPath', baseNode)))(state);

export const grandParentNodeSelector = state => baseNode =>
    byContextPathSelector(parentNodeContextPath(parentNodeContextPath($get('contextPath', baseNode))))(state);

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

export const focusedNodeTypeSelector = createSelector(
    [
        focusedSelector
    ],
    focused =>
        $get('nodeType', focused)
);

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

const getPathInNode = (state, contextPath, propertyPath) => {
    const node = $get(['cr', 'nodes', 'byContextPath', contextPath], state);

    return $get(propertyPath, node);
};

export const makeGetAllowedChildNodeTypesSelector = (nodeTypesRegistry, elevator = id => id) => createSelector(
    [
        (state, {subject}) => getPathInNode(state, subject, 'isAutoCreated'),
        (state, {reference}) => getPathInNode(state, elevator(reference), 'name'),
        (state, {reference}) => getPathInNode(state, elevator(reference), 'nodeType'),
        (state, {reference}) => getPathInNode(state, elevator(parentNodeContextPath(reference)), 'nodeType')
    ],
    (...args) => nodeTypesRegistry.getAllowedNodeTypesTakingAutoCreatedIntoAccount(...args)
);

export const makeGetAllowedSiblingNodeTypesSelector = nodeTypesRegistry =>
    makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry, parentNodeContextPath);

export const makeCanBeInsertedAlongsideSelector = nodeTypesRegistry => createSelector(
    [
        (state, {subject}) => getPathInNode(state, subject, 'nodeType'),
        makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry)
    ],
    (subjectNodeType, allowedNodeTypes) => allowedNodeTypes.includes(subjectNodeType)
);

export const makeCanBeInsertedIntoSelector = nodeTypesRegistry => createSelector(
    [
        (state, {subject}) => getPathInNode(state, subject, 'nodeType'),
        makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry)
    ],
    (subjectNodeType, allowedNodeTypes) => allowedNodeTypes.includes(subjectNodeType)
);

export const makeCanBeInsertedSelector = nodeTypesRegistry => createSelector(
    [
        makeCanBeInsertedAlongsideSelector(nodeTypesRegistry),
        makeCanBeInsertedIntoSelector(nodeTypesRegistry)
    ],
    (canBeInsertedAlongside, canBeInsertedInto) => (canBeInsertedAlongside || canBeInsertedInto)
);
