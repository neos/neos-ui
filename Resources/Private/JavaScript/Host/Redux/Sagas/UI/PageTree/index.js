import {takeLatest} from 'redux-saga';
import {put} from 'redux-saga/effects';
import {$get, $transform} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/';
import {CR} from 'Host/Selectors/';

const getDocumentNodes = CR.Nodes.byNodeTypeSelector('TYPO3.Neos:Document');

export function* watchBoot(getState) {
    yield* takeLatest(actionTypes.System.BOOT, function* generatePageTreeData() {
        const state = getState();
        const documentNodes = getDocumentNodes(state);

        yield documentNodes.map(
            node => $transform({
                contextPath: $get('contextPath'),
                label: $get('label'),
                icon: $get('nodeType.ui.icon'),
                isLoading: false,
                isCollapsed: true,
                hasChildren: $get('children').length > 0,
                hasError: false
            }, node)
        ).map(node => put(actions.UI.PageTree.add(node.contextPath, node)));
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
        const childrenAreFullyLoaded = $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state).every(
            contextPath => Boolean($get(['cr', 'nodes', 'byContextPath', contextPath], state))
        );

        if (childrenAreFullyLoaded) {
            yield put(actions.UI.PageTree.uncollapse(contextPath));
        } else {
            yield put(actions.UI.PageTree.requestChildren(contextPath));
            try {
                const response = yield fetch('/che!/service/get-child-nodes', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'X-Flow-Csrftoken': window.neos.csrfToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contextPath,
                        nodeTypeFilter: 'TYPO3.Neos:Document'
                    })
                });

                if (!response.ok) {
                    throw new Error(`Could not load child nodes: ${response.statusText}`);
                }

                yield childNodes.map(
                    node => $transform({
                        contextPath: $get('contextPath'),
                        label: $get('label'),
                        icon: $get('nodeType.ui.icon'),
                        isLoading: false,
                        isCollapsed: true,
                        hasChildren: $get('children').length > 0,
                        hasError: false
                    }, node)
                ).map(node => put(actions.UI.PageTree.add(node.contextPath, node)));

                yield put(actions.UI.PageTree.uncollapse(contextPath));
            } catch (err) {
                yield put(actions.UI.PageTree.invalidate(contextPath));
                yield put(actions.UI.FlashMessages.add('loadChildNodesError', err.message, 'error'));
            }
        }
    });
}
