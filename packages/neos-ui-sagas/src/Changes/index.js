import {takeEvery, put, call, select} from 'redux-saga/effects';

import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

function * persistChanges(changes) {
    const {change} = backend.get().endpoints;

    yield put(actions.UI.Remote.startSaving());

    try {
        const feedback = yield call(change, changes);
        yield put(actions.ServerFeedback.handleServerFeedback(feedback));
    } catch (error) {
        console.error('Failed to persist changes', error);
    } finally {
        yield put(actions.UI.Remote.finishSaving());
    }
}

export function * watchPersist() {
    let changes = [];

    yield takeEvery([actionTypes.Changes.PERSIST, actionTypes.UI.Remote.FINISH_SAVING], function * (action) {
        if (action.type === actionTypes.Changes.PERSIST) {
            changes.push(...action.payload.changes);

            // We immediately optimistically update node properties in state, before sending the persist request
            const propertyChanges = action.payload.changes
                .filter(change => change.type === 'Neos.Neos.Ui:Property')
                .map(change => ({
                    subject: change.subject,
                    propertyName: change.payload.propertyName,
                    value: change.payload.value
                }));
            if (propertyChanges.length > 0) {
                yield put(actions.CR.Nodes.changeProperty(propertyChanges));
            }
        }

        const state = yield select();
        // If there's already a pending request, don't start the new one;
        // the data will be stored in `changes` closure and when the current request finishes saving
        // it will be re-triggered by FINISH_SAVING
        if (changes.length > 0 && !state?.ui?.remote?.isSaving) {
            // we need to clear out the changes array before yield, so the best I could think of is this
            const clonedChanges = changes.slice(0);
            changes = [];
            yield call(persistChanges, clonedChanges);
        }
    });
}
