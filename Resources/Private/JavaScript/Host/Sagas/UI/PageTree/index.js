import {takeLatest, takeEvery} from 'redux-saga';
import {put} from 'redux-saga/effects';
import {$get, $transform} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/index';
import {CR} from 'Host/Selectors/index';

const getDocumentNodes = CR.Nodes.byNodeTypeSelector('TYPO3.Neos:Document');
const isDocumentNode = CR.Nodes.isOfTypeSelector('TYPO3.Neos:Document');
const isDocumentType = CR.NodeTypes.isOfTypeSelector('TYPO3.Neos:Document');
const getNode = CR.Nodes.byContextPathSelector;
const createTreeNode = (node, state) => $transform({
    contextPath: $get('contextPath'),
    label: $get('label'),
    uri: $get('uri'),
    icon: $get('nodeType.ui.icon'),
    isLoading: false,
    isCollapsed: true,
    hasChildren: $get('children', node).filter(childEnvelope => isDocumentType(childEnvelope.nodeType)(state)).length > 0,
    hasError: false
}, node);

export function* watchBoot(getState) {
    yield* takeLatest(actionTypes.System.BOOT, function* generatePageTreeData() {
        const state = getState();
        const documentNodes = getDocumentNodes(state);

        yield put(actions.UI.PageTree.add(
            documentNodes.toArray().map(node => createTreeNode(node.toJS(), state))
        ));
    });
}

export function* watchAddNode(getState) {
    yield* takeEvery(actionTypes.CR.Nodes.ADD, function* generatePageTreeData(action) {
        const state = getState();
        const {contextPath} = action.payload;

        if (isDocumentNode(contextPath)(state)) {
            const node = getNode(contextPath)(state);

            yield put(actions.UI.PageTree.add([createTreeNode(node, state)]));
        }
    });
}

export function* watchToggle(getState) {
    yield* takeLatest(actionTypes.UI.PageTree.TOGGLE, function* toggleTreeNode(action) {
        const state = getState();
        const {contextPath} = action.payload;
        const isCollapsed = $get(['ui', 'pageTree', 'nodesByContextPath', contextPath, 'isCollapsed'], state);

        if (isCollapsed) {
            yield put(actions.UI.PageTree.commenceUncollapse(contextPath));
        } else {
            yield put(actions.UI.PageTree.collapse(contextPath));
        }
    });
}

export function* watchCommenceUncollapse(getState) {
    yield* takeLatest(actionTypes.UI.PageTree.COMMENCE_UNCOLLAPSE, function* uncollapseNode(action) {
        const state = getState();
        const {contextPath} = action.payload;
        const childrenAreFullyLoaded = $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state)
            .filter(childEnvelope => isDocumentType(childEnvelope.nodeType)(state))
            .every(
                childEnvelope => Boolean($get(['cr', 'nodes', 'byContextPath', childEnvelope.contextPath], state))
            );

        if (childrenAreFullyLoaded) {
            yield put(actions.UI.PageTree.uncollapse(contextPath));
        } else {
            yield put(actions.UI.PageTree.requestChildren(contextPath));
            try {
                const {q} = window.neos;
                const childNodes = yield q(contextPath).children('[instanceof TYPO3.Neos:Document]').get();

                yield childNodes.map(node => put(actions.CR.Nodes.add(node.contextPath, node)));

                yield put(actions.UI.PageTree.uncollapse(contextPath));
            } catch (err) {
                yield put(actions.UI.PageTree.invalidate(contextPath));
                yield put(actions.UI.FlashMessages.add('loadChildNodesError', err.message, 'error'));
            }
        }
    });
}
