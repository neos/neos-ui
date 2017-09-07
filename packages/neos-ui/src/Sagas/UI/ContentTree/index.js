import {takeLatest} from 'redux-saga';
import {put, select} from 'redux-saga/effects';
import {$get, $contains} from 'plow-js';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import {parentNodeContextPath, isNodeCollapsed} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';

import backend from '@neos-project/neos-ui-backend-connector';

function * watchReloadTree({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const {q} = backend.get();

    yield * takeLatest(actionTypes.UI.ContentTree.RELOAD_TREE, function * reloadTree() {
        const FILTER_COLLECTIONS = `[instanceof ${nodeTypesRegistry.getRole('contentCollection')}]`;
        const FILTER_CONTENT = `[instanceof ${nodeTypesRegistry.getRole('content')}]`;
        const FILTER_BOTH = `${FILTER_COLLECTIONS},${FILTER_CONTENT}`;

        yield put(actions.UI.ContentTree.startLoading());

        const documentNodeContextPath = yield select($get('ui.contentCanvas.contextPath'));
        const self = yield q(documentNodeContextPath).get();
        const directChildNodes = yield q(documentNodeContextPath).children(FILTER_BOTH).get();
        const consecutiveChildNodes = yield q(directChildNodes).find(FILTER_BOTH).get();

        yield put(actions.UI.ContentTree.stopLoading());

        yield put(actions.CR.Nodes.add(self.concat(directChildNodes, consecutiveChildNodes).reduce((result, node) => {
            result[node.contextPath] = node;
            return result;
        }, {})));
    });
}

function * watchNodeFocus({configuration}) {
    yield * takeLatest(actionTypes.CR.Nodes.FOCUS, function * loadContentNodeRootLine(action) {
        const {contextPath} = action.payload;
        const documentNodeContextPath = yield select($get('ui.contentCanvas.contextPath'));

        let parentContextPath = contextPath;

        const documentNode = yield select(selectors.UI.ContentCanvas.documentNodeSelector);
        const loadingDepth = configuration.structureTree.loadingDepth;
        while (parentContextPath !== documentNodeContextPath) {
            parentContextPath = parentNodeContextPath(parentContextPath);
            if (!parentContextPath) {
                // in case our focused node is not on the current document, documentNodeContextPath
                // can never be an anchestor of contextPath. In this case, we traverse the path until
                // we reached the top level, where we need to abort the loop to avoid infinite spinning.
                break;
            }
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(parentContextPath);
            const node = yield select(getNodeByContextPathSelector);
            const isToggled = yield select($contains(parentContextPath, 'ui.contentTree.toggled'));
            const isCollapsed = isNodeCollapsed(node, isToggled, documentNode, loadingDepth);

            if (!node || isCollapsed) {
                yield put(actions.UI.ContentTree.toggle(parentContextPath));
            }
        }
    });
}

export const sagas = [
    watchReloadTree,
    watchNodeFocus
];
