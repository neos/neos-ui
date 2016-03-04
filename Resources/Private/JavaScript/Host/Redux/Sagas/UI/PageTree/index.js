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
            node => console.log('test') || $transform({
                contextPath: $get('contextPath'),
                label: $get('label'),
                isLoading: false,
                isCollapsed: true,
                hasError: false
            }, node)
        ).map(node => put(actions.UI.PageTree.add(node.contextPath, node)));
    });
}
