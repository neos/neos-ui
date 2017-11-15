import {takeLatest, take, put, race, select} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

export default function * removeNodeIfConfirmed() {
    yield * takeLatest(actionTypes.CR.Nodes.COMMENCE_REMOVAL, function * waitForConfirmation() {
        const state = yield select();
        const waitForNextAction = yield race([
            take(actionTypes.CR.Nodes.REMOVAL_ABORTED),
            take(actionTypes.CR.Nodes.REMOVAL_CONFIRMED)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Nodes.REMOVAL_ABORTED) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Nodes.REMOVAL_CONFIRMED) {
            const nodeToBeRemovedContextPath = $get('cr.nodes.toBeRemoved', state);

            yield put(actions.Changes.persistChanges([{
                type: 'Neos.Neos.Ui:RemoveNode',
                subject: nodeToBeRemovedContextPath
            }]));
        }
    });
}
