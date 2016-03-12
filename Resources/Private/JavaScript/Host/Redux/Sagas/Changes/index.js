import {takeEvery} from 'redux-saga';
import {put} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/index';

const getChanges = $get('changes.pending');

export function* watchAdd(getState) {
    yield* takeEvery(actionTypes.Changes.ADD, function* triggerStart() {
        const {csrfToken} = window.neos;
        const state = getState();
        const changes = getChanges(state);

        if (changes.length) {
            yield put(actions.Changes.start());
            yield put(actions.UI.Remote.startSaving());

            yield fetch('/che!/service/change', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-Flow-Csrftoken': csrfToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    changes
                })
            })
            .then(response => response.json());

            yield put(actions.UI.Remote.finishSaving());
            yield put(actions.Changes.finish());
        }
    });
}
