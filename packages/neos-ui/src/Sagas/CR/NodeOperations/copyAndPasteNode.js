import {takeEvery, take, put, race, select, call} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import determineInsertMode from './determineInsertMode';
import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

export default function * copyAndPasteNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const canBeInsertedAlongsideSelector = selectors.CR.Nodes.makeCanBeCopiedAlongsideSelector(nodeTypesRegistry);
    const canBeInsertedIntoSelector = selectors.CR.Nodes.makeCanBeCopiedIntoSelector(nodeTypesRegistry);

    yield * takeEvery(actionTypes.CR.Nodes.COPY, function * waitForPaste() {
        const subject = yield select($get('cr.nodes.clipboard'));

        const waitForNextAction = yield race([
            take(actionTypes.CR.Nodes.COPY),
            take(actionTypes.CR.Nodes.CUT),
            take(actionTypes.CR.Nodes.PASTE)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Nodes.COPY) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Nodes.CUT) {
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
                actionTypes.CR.Nodes.COPY
            );

            if (mode) {
                yield put(actions.Changes.persistChanges([{
                    type: calculateChangeTypeFromMode(mode, 'Copy'),
                    subject,
                    payload: calculateDomAddressesFromMode(mode, reference, fusionPath)
                }]));
            }

            //
            // Keep the loop runnning
            //
            yield put(actions.CR.Nodes.copy(subject));
        }
    });
}
