import {takeEvery} from 'redux-saga';
import {take, put, race, select, call} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import determineInsertMode from './determineInsertMode';
import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

export default function * cutAndPasteNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const canBeInsertedAlongsideSelector = selectors.CR.Nodes.makeCanBeInsertedAlongsideSelector(nodeTypesRegistry);
    const canBeInsertedIntoSelector = selectors.CR.Nodes.makeCanBeInsertedIntoSelector(nodeTypesRegistry);

    yield * takeEvery(actionTypes.CR.Nodes.CUT, function * waitForPaste() {
        const subject = yield select($get('cr.nodes.clipboard'));

        const waitForNextAction = yield race([
            take(actionTypes.CR.Nodes.CUT),
            take(actionTypes.CR.Nodes.COPY),
            take(actionTypes.CR.Nodes.PASTE)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Nodes.CUT) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Nodes.COPY) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Nodes.PASTE) {
            const {contextPath: reference, fusionPath} = nextAction.payload;
            const canBeInsertedAlongside = yield select(canBeInsertedAlongsideSelector, {subject, reference});
            const canBeInsertedInto = yield select(canBeInsertedIntoSelector, {subject, reference});

            const mode = yield call(
                determineInsertMode,
                subject,
                reference,
                canBeInsertedAlongside,
                canBeInsertedInto,
                actionTypes.CR.Nodes.CUT
            );

            if (mode) {
                yield put(actions.Changes.persistChange({
                    type: calculateChangeTypeFromMode(mode, 'Move'),
                    subject,
                    payload: calculateDomAddressesFromMode(mode, reference, fusionPath)
                }));
            }
        }
    });
}
