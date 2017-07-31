import {takeLatest, takeEvery} from 'redux-saga';
import {put, select} from 'redux-saga/effects';
import {$get, $contains} from 'plow-js';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

import {parentNodeContextPath} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';

function * watchToggle() {
    yield * takeLatest(actionTypes.UI.PageTree.TOGGLE, function * toggleTreeNode(action) {
        const state = yield select();
        const {contextPath} = action.payload;
        const isCollapsed = !$contains(contextPath, 'ui.pageTree.uncollapsed', state);

        if (isCollapsed) {
            yield put(actions.UI.PageTree.commenceUncollapse(contextPath));
        } else {
            yield put(actions.UI.PageTree.collapse(contextPath));
        }
    });
}

function * watchRequestChildrenForContextPath({configuration}) {
    yield * takeEvery(actionTypes.UI.PageTree.REQUEST_CHILDREN, function * requestChildrenForContextPath(action) {
        // ToDo Call yield put(actions.UI.PageTree.requestChildren(contextPath));
        const {contextPath, opts} = action.payload;
        const {unCollapse, activate} = opts;
        const {q} = backend.get();
        let parentNodes;
        let childNodes;
        yield put(actions.UI.PageTree.setAsLoading(contextPath));

        try {
            const query = q(contextPath);

            parentNodes = yield query.getForTree();
            const baseNodeType = configuration.nodeTree.presets.default.baseNodeType;
            childNodes = yield query.neosUiFilteredChildren(baseNodeType).getForTree();
        } catch (err) {
            yield put(actions.UI.PageTree.invalidate(contextPath));
            yield put(actions.UI.FlashMessages.add('loadChildNodesError', err.message, 'error'));
        }

        yield put(actions.UI.PageTree.setAsLoaded(contextPath));

        if (childNodes && parentNodes) {
            const nodes = parentNodes.concat(childNodes).reduce((nodeMap, node) => {
                nodeMap[$get('contextPath', node)] = node;
                return nodeMap;
            }, {});

            // the nodes loaded from the server for the tree representation are NOT the full
            // nodes with all properties; but merely contain as little properties as needed
            // for the tree.
            // In order to not OVERRIDE the properties we already know, we need to merge
            // the data which the nodes already in the system; and not override them completely.
            yield put(actions.CR.Nodes.merge(nodes));

            if (unCollapse) {
                yield put(actions.UI.PageTree.uncollapse(contextPath));
            }

            //
            // ToDo: Set the ContentCanvas src / contextPath
            //
            if (activate) {
                yield put(actions.UI.PageTree.focus(contextPath));
            }
        }
    });
}

function * watchNodeCreated() {
    yield * takeLatest(actionTypes.UI.Remote.DOCUMENT_NODE_CREATED, function * nodeCreated(action) {
        const {contextPath} = action.payload;

        yield put(actions.UI.PageTree.requestChildren(contextPath, {activate: true}));
    });
}

function * watchCommenceUncollapse({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');

    yield * takeLatest(actionTypes.UI.PageTree.COMMENCE_UNCOLLAPSE, function * uncollapseNode(action) {
        const state = yield select();
        const {contextPath} = action.payload;
        const childrenAreFullyLoaded = $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state).toJS()
            .filter(childEnvelope => nodeTypesRegistry.hasRole(childEnvelope.nodeType, 'document'))
            .every(
                childEnvelope => Boolean($get(['cr', 'nodes', 'byContextPath', $get('contextPath', childEnvelope)], state))
            );

        if (childrenAreFullyLoaded) {
            yield put(actions.UI.PageTree.uncollapse(contextPath));
        } else {
            yield put(actions.UI.PageTree.requestChildren(contextPath));
        }
    });
}

function * watchReloadTree({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    yield * takeLatest(actionTypes.UI.PageTree.RELOAD_TREE, function * reloadTree() {
        const documentNodes = yield select(selectors.CR.Nodes.makeGetDocumentNodes(nodeTypesRegistry));
        const uncollapsedContextPaths = yield select(selectors.UI.PageTree.getUncollapsed);
        const nodesToReload = documentNodes.toArray().filter(node => uncollapsedContextPaths.includes(node.get('contextPath')));

        for (let i = 0; i < nodesToReload.length; i++) {
            const node = nodesToReload[i];
            const contextPath = node.get('contextPath');

            yield put(actions.UI.PageTree.requestChildren(contextPath, {unCollapse: false}));
        }
    });
}

function * watchCurrentDocument() {
    yield * takeLatest(actionTypes.UI.ContentCanvas.SET_CONTEXT_PATH, function * loadDocumentRootLine(action) {
        const {contextPath} = action.payload;
        const siteNodeContextPath = yield select($get('cr.nodes.siteNode'));
        const {q} = backend.get();

        let parentContextPath = contextPath;

        while (parentContextPath !== siteNodeContextPath) {
            parentContextPath = parentNodeContextPath(parentContextPath);
            const isInStore = yield select($get(['cr', 'nodes', 'byContextPath', parentContextPath]));
            const isUnCollapsed = yield select($contains(parentContextPath, 'ui.pageTree.uncollapsed'));

            if (!isInStore || !isUnCollapsed) {
                yield put(actions.UI.PageTree.setAsLoading(siteNodeContextPath));
            }

            if (!isInStore) {
                const nodes = yield q(parentContextPath).get();
                yield put(actions.CR.Nodes.add(nodes.reduce((nodeMap, node) => {
                    nodeMap[$get('contextPath', node)] = node;
                    return nodeMap;
                }, {})));
            }

            if (!isUnCollapsed) {
                yield put(actions.UI.PageTree.commenceUncollapse(parentContextPath));
            }
        }

        yield put(actions.UI.PageTree.setAsLoaded(siteNodeContextPath));
    });
}

export const sagas = [
    watchToggle,
    watchCommenceUncollapse,
    watchRequestChildrenForContextPath,
    watchNodeCreated,
    watchReloadTree,
    watchCurrentDocument
];
