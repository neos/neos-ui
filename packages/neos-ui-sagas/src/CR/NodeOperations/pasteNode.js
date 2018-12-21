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
        const subject = yield select($get('cr.nodes.clipboard'));
        const clipboardMode = yield select($get('cr.nodes.clipboardMode'));

        const {contextPath: reference, fusionPath} = action.payload;
        const canBeInsertedAlongside = yield select(canBeInsertedAlongsideSelector, {subject, reference});
        const canBeInsertedInto = yield select(canBeInsertedIntoSelector, {subject, reference});

        const mode = yield call(
            determineInsertMode,
            subject,
            reference,
            canBeInsertedAlongside,
            canBeInsertedInto,
            clipboardMode === 'Copy' ? actionTypes.CR.Nodes.COPY : actionTypes.CR.Nodes.CUT
        );

        if (mode) {
            yield put(actions.CR.Nodes.commitPaste(clipboardMode));
            yield put(actions.Changes.persistChanges([{
                type: calculateChangeTypeFromMode(mode, clipboardMode),
                subject,
                payload: calculateDomAddressesFromMode(mode, reference, fusionPath)
            }]));
        }
    });
}
