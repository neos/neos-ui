import {takeLatest, put, select, takeEvery} from 'redux-saga/effects';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import {isNodeCollapsed} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';

import backend from '@neos-project/neos-ui-backend-connector';

export function * watchReloadTree({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const {q} = backend.get();

    yield takeLatest(actionTypes.UI.ContentTree.RELOAD_TREE, function * reloadTree() {
        const FILTER_COLLECTIONS = `[instanceof ${nodeTypesRegistry.getRole('contentCollection')}]`;
        const FILTER_CONTENT = `[instanceof ${nodeTypesRegistry.getRole('content')}]`;
        const FILTER_BOTH = `${FILTER_COLLECTIONS},${FILTER_CONTENT}`;

        yield put(actions.UI.ContentTree.startLoading());

        const documentNodeContextPath = yield select(
            state => state?.cr?.nodes?.documentNode
        );
        const self = yield q(documentNodeContextPath).get();
        const directChildNodes = yield q(documentNodeContextPath).children(FILTER_BOTH).get();
        const consecutiveChildNodes = yield q(directChildNodes).find(FILTER_BOTH).get();

        yield put(actions.UI.ContentTree.stopLoading());

        yield put(actions.CR.Nodes.merge(self.concat(directChildNodes, consecutiveChildNodes).reduce((result, node) => {
            result[node.contextPath] = node;
            return result;
        }, {})));
    });
}

export function * watchNodeFocus({configuration}) {
    yield takeLatest(actionTypes.CR.Nodes.FOCUS, function * loadContentNodeRootLine(action) {
        const {contextPath} = action.payload;
        const documentNodeContextPath = yield select(
            state => state?.cr?.nodes?.documentNode
        );

        let parentContextPath = contextPath;

        const documentNode = yield select(selectors.CR.Nodes.documentNodeSelector);
        const {loadingDepth} = configuration.structureTree;

        while (parentContextPath !== documentNodeContextPath) {
            const parentContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(parentContextPath);
            const parentNode = yield select(parentContextPathSelector);

            if (!parentNode || !parentNode.parent) {
                // In case our focused node is not on the current document, documentNodeContextPath
                // can never be an ancestor of contextPath. In this case, we traverse the path until
                // we reached the top level, where we need to abort the loop to avoid infinite spinning.
                break;
            }

            // eslint-disable-next-line require-atomic-updates
            parentContextPath = parentNode.parent;

            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(parentContextPath);
            const node = yield select(getNodeByContextPathSelector);
            const isToggled = yield select(
                state => state?.ui?.contentTree?.toggled?.includes(parentContextPath)
            );
            const isCollapsed = (node ? isNodeCollapsed(node, isToggled, documentNode, loadingDepth) : false);

            if (!node || isCollapsed) {
                yield put(actions.UI.ContentTree.toggle(parentContextPath));
            }
        }
    });
}

export function * watchToggle({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    yield takeLatest(actionTypes.UI.ContentTree.TOGGLE, function * toggleTreeNode(action) {
        const state = yield select();
        const contextPath = action.payload;

        const children = state?.cr?.nodes?.byContextPath?.[contextPath]?.children;

        if (!children) {
            return;
        }

        const checkIfChildrenAreFullyLoadedRecursively = contextPath => {
            const children = state?.cr?.nodes?.byContextPath?.[contextPath]?.children;

            return children
            ?.filter(childEnvelope => nodeTypesRegistry.hasRole(childEnvelope.nodeType, 'content') || nodeTypesRegistry.hasRole(childEnvelope.nodeType, 'contentCollection'))
            ?.every(
                childEnvelope =>
                    state?.cr?.nodes?.byContextPath?.[childEnvelope?.contextPath] &&
                    checkIfChildrenAreFullyLoadedRecursively(childEnvelope?.contextPath)
            ) ?? true;
        };
        const childrenAreFullyLoaded = checkIfChildrenAreFullyLoadedRecursively(contextPath);

        if (!childrenAreFullyLoaded) {
            yield put(actions.UI.ContentTree.requestChildren(contextPath));
        }
    });
}

export function * watchRequestChildrenForContextPath({globalRegistry}) {
    yield takeEvery(actionTypes.UI.ContentTree.REQUEST_CHILDREN, function * requestChildrenForContextPath(action) {
        // TODO: Call yield put(actions.UI.ContentTree.requestChildren(contextPath));
        const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
        const {contextPath} = action.payload;
        const {q} = backend.get();
        let parentNodes;
        let childNodes;
        yield put(actions.UI.ContentTree.setAsLoading(contextPath));

        try {
            const query = q(contextPath);

            parentNodes = yield query.getForTree();

            const nodeTypeFilter = `${nodeTypesRegistry.getRole('contentCollection')},${nodeTypesRegistry.getRole('content')}`;
            childNodes = yield query.neosUiFilteredChildren(nodeTypeFilter).get();
        } catch (err) {
            yield put(actions.UI.ContentTree.invalidate(contextPath));
            yield put(actions.UI.FlashMessages.add('loadChildNodesError', err.message, 'error'));
        }

        yield put(actions.UI.ContentTree.setAsLoaded(contextPath));

        if (childNodes && parentNodes) {
            const nodes = parentNodes.concat(childNodes).reduce((nodeMap, node) => {
                nodeMap[node?.contextPath] = node;
                return nodeMap;
            }, {});
            yield put(actions.CR.Nodes.merge(nodes));
        }
    });
}

export function * watchCurrentDocument({globalRegistry, configuration}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const {q} = backend.get();

    yield takeLatest(actionTypes.CR.Nodes.SET_DOCUMENT_NODE, function * loadContentForDocument(action) {
        const contextPath = action.payload.documentNode;
        const siteNode = yield select(selectors.CR.Nodes.siteNodeSelector);

        // siteNode may be null for a short time when navigating to a page in a different dimension, before the new state is loaded
        if (!siteNode) {
            return;
        }

        // Always reload the nodes for the current page, when the document node changes.
        // In the past, the guest frame loaded the latest nodedata from the rendered content, but this has been removed.
        yield put(actions.UI.ContentTree.setAsLoading(contextPath));

        const nodeTypeFilter = `${nodeTypesRegistry.getRole('contentCollection')},${nodeTypesRegistry.getRole('content')}`;
        const nodes = yield q([contextPath]).neosUiDefaultNodes(
            nodeTypeFilter,
            configuration.structureTree.loadingDepth,
            [],
            []
        ).get();
        const nodeMap = nodes.reduce((nodeMap, node) => {
            nodeMap[node?.contextPath] = node;
            return nodeMap;
        }, {});

        yield put(actions.CR.Nodes.merge(nodeMap));
        yield put(actions.UI.ContentTree.setAsLoaded(contextPath));
    });
}
