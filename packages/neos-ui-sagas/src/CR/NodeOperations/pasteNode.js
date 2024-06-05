import {takeEvery, put, select, call} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import determineInsertMode from './determineInsertMode';
import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

export default function * pasteNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const canBeInsertedAlongsideSelector = selectors.CR.Nodes.makeCanBeCopiedAlongsideSelector(nodeTypesRegistry);
    const canBeInsertedIntoSelector = selectors.CR.Nodes.makeCanBeCopiedIntoSelector(nodeTypesRegistry);

    yield takeEvery(actionTypes.CR.Nodes.PASTE, function * waitForPaste(action) {
        const subject = yield select(selectors.CR.Nodes.clipboardNodesContextPathsSelector);
        const clipboardMode = yield select($get('cr.nodes.clipboardMode'));

        const {contextPath: reference, fusionPath} = action.payload;
        const state = yield select();
        const canBeInsertedAlongside = subject.every(contextPath => {
            const result = canBeInsertedAlongsideSelector(state, {subject: contextPath, reference});
            return result;
        });
        const canBeInsertedInto = subject.every(contextPath => {
            const result = canBeInsertedIntoSelector(state, {subject: contextPath, reference});
            return result;
        });

        const mode = yield call(
            determineInsertMode,
            subject,
            reference,
            canBeInsertedAlongside,
            canBeInsertedInto,
            clipboardMode === 'Copy' ? actionTypes.CR.Nodes.COPY : actionTypes.CR.Nodes.CUT
        );

        if (mode) {
            const referenceNodeSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(reference);
            const referenceNode = yield select(referenceNodeSelector);
            const baseNodeType = yield select($get('ui.pageTree.filterNodeType'));
            const changeType = calculateChangeTypeFromMode(mode, clipboardMode);
            const domAddresses = calculateDomAddressesFromMode(mode, referenceNode, fusionPath);

            yield put(actions.CR.Nodes.commitPaste(clipboardMode));
            let changes = subject.map(contextPath => ({
                type: changeType,
                subject: contextPath,
                payload: {
                    ...domAddresses,
                    baseNodeType
                }
            }));

            // Reverse the order of nodes if we are pasting after the reference node as the insertions are all
            // applied to the same reference node and would otherwise be applied in reverse order.
            if (mode === 'after') {
                changes = changes.reverse();
            }

            yield put(actions.Changes.persistChanges(changes));
        }
    });
}
