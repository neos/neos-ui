import {takeLatest, takeEvery} from 'redux-saga';
import {put, select} from 'redux-saga/effects';
import {$get, $contains} from 'plow-js';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

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

function * requestChildrenForContextPath(action) {
    // ToDo Call yield put(actions.UI.PageTree.requestChildren(contextPath));
    const {contextPath, opts} = action.payload;
    const {unCollapse, activate} = opts;
    const {q} = backend.get();
    let parentNodes;
    let childNodes;

    yield put(actions.UI.PageTree.setAsLoading(contextPath));

    try {
        const query = q(contextPath);

        parentNodes = yield query.get();
        childNodes = yield query.children('[instanceof TYPO3.Neos:Document]').get();
    } catch (err) {
        yield put(actions.UI.PageTree.invalidate(contextPath));
        yield put(actions.UI.FlashMessages.add('loadChildNodesError', err.message, 'error'));
    }

    yield put(actions.UI.PageTree.setAsLoaded(contextPath));

    if (childNodes && parentNodes) {
        const nodes = parentNodes.concat(childNodes);

        yield nodes.map(node => put(actions.CR.Nodes.add(node.contextPath, node)));

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
}

function * watchRequestChildrenForContextPath() {
    yield * takeEvery(actionTypes.UI.PageTree.REQUEST_CHILDREN, requestChildrenForContextPath);
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
            .filter(childEnvelope => nodeTypesRegistry.isOfType(childEnvelope.nodeType, 'TYPO3.Neos:Document'))
            .every(
                childEnvelope => Boolean($get(['cr', 'nodes', 'byContextPath', childEnvelope.contextPath], state))
            );

        if (childrenAreFullyLoaded) {
            yield put(actions.UI.PageTree.uncollapse(contextPath));
        } else {
            yield put(actions.UI.PageTree.requestChildren(contextPath));
        }
    });
}

function * watchReloadTree() {
    yield * takeLatest(actionTypes.UI.PageTree.RELOAD_TREE, function * reloadTree(action) {
        //
        // ToDo: passing the nodeTypesRegistry via the action is pretty dirty, find a way
        // to access the registry more directly.
        //
        const {nodeTypesRegistry} = action.payload;
        const documentNodes = yield select(selectors.CR.Nodes.makeGetDocumentNodes(nodeTypesRegistry));
        const uncollapsedContextPaths = yield select(selectors.UI.PageTree.getUncollapsedContextPaths);
        const nodesToReload = documentNodes.filter(node => uncollapsedContextPaths.includes(node.contextPath));

        for (let i = 0; i < nodesToReload.length; i++) {
            const {contextPath} = nodesToReload[i];

            yield put(actions.UI.PageTree.requestChildren(contextPath, {unCollapse: false}));
        }
    });
}

export const sagas = [
    watchToggle,
    watchCommenceUncollapse,
    watchRequestChildrenForContextPath,
    watchNodeCreated,
    watchReloadTree
];
