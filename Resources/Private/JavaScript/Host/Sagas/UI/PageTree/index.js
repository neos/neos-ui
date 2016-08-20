import {takeLatest} from 'redux-saga';
import {put, select} from 'redux-saga/effects';
import {$get, $contains} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/index';
import {CR} from 'Host/Selectors/index';
import {api} from 'Shared/Utilities/';

const isDocumentType = CR.NodeTypes.isOfTypeSelector('TYPO3.Neos:Document');

export function * watchToggle() {
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

export function * watchCommenceUncollapse() {
    yield * takeLatest(actionTypes.UI.PageTree.COMMENCE_UNCOLLAPSE, function * uncollapseNode(action) {
        const state = yield select();
        const {contextPath} = action.payload;
        const childrenAreFullyLoaded = $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state).toJS()
            .filter(childEnvelope => isDocumentType(childEnvelope.nodeType)(state))
            .every(
                childEnvelope => Boolean($get(['cr', 'nodes', 'byContextPath', childEnvelope.contextPath], state))
            );

        if (childrenAreFullyLoaded) {
            yield put(actions.UI.PageTree.uncollapse(contextPath));
        } else {
            yield put(actions.UI.PageTree.requestChildren(contextPath));
            try {
                const {q} = api.get();
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
