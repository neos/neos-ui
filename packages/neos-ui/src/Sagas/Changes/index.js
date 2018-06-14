import {take, race, put, call, select} from 'redux-saga/effects';
import {delay} from 'redux-saga'
import {$get} from 'plow-js';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

const {publishableNodesInDocumentSelector, baseWorkspaceSelector} = selectors.CR.Workspaces;

const saveDelay = 2000;

function * persistChanges(changes) {
    const {change} = backend.get().endpoints;

    yield put(actions.UI.Remote.startSaving());

    try {
        const feedback = yield call(change, changes);
        yield put(actions.UI.Remote.finishSaving());
        yield put(actions.ServerFeedback.handleServerFeedback(feedback));

        const state = yield select();
        const isAutoPublishingEnabled = $get('user.settings.isAutoPublishingEnabled', state);

        if (isAutoPublishingEnabled) {
            const baseWorkspace = baseWorkspaceSelector(state);
            const publishableNodesInDocument = publishableNodesInDocumentSelector(state);
            yield put(actions.CR.Workspaces.publish(publishableNodesInDocument.map($get('contextPath')), baseWorkspace));
        }
    } catch (error) {
        console.error('Failed to persist changes', error);
    } finally {
        yield put(actions.UI.Remote.finishSaving());
    }
}

export function * watchPersist() {
    let changes = [];
    let lastPush = Date.now();
    let actionsTaken = 0;

    while (true) {
        const now = Date.now();
        const timeSinceLastPush = now - lastPush;

        const {action} = yield race({
            action: take(actionTypes.Changes.PERSIST),
            time: call(delay, saveDelay)
        });

        if (action) {
            changes.push(...action.payload.changes);
            actionsTaken++;
        }

        const state = yield select();

        /*
         *  We actually persist IF:
         *  - we have changes AND
         *  - there is not another request running
         *  - either the "saveDelay" time has passed OR we have taken 3 actions (to avoid huge change queues locally)
         */
        if (changes.length > 0 && !$get('ui.remote.isSaving', state) && (timeSinceLastPush > saveDelay || actionsTaken > 2)) {
            yield call(persistChanges, changes);
            changes = [];
            lastPush = now;
            actionsTaken = 0;
        }
    }
}

