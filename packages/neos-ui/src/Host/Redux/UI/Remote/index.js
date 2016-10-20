import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from 'Host/Redux/System/index';

const START_SAVING = '@neos/neos-ui/UI/Remote/START_SAVING';
const FINISH_SAVING = '@neos/neos-ui/UI/Remote/FINISH_SAVING';
const START_PUBLISHING = '@neos/neos-ui/UI/Remote/START_PUBLISHING';
const FINISH_PUBLISHING = '@neos/neos-ui/UI/Remote/FINISH_PUBLISHING';
const START_DISCARDING = '@neos/neos-ui/UI/Remote/START_DISCARDING';
const FINISH_DISCARDING = '@neos/neos-ui/UI/Remote/FINISH_DISCARDING';

/**
 * Marks an ongoing saving process.
 */
const startSaving = createAction(START_SAVING);

/**
 * Marks that an ongoing saving process has finished.
 */
const finishSaving = createAction(FINISH_SAVING);

/**
 * Marks an ongoing publishing process.
 */
const startPublishing = createAction(START_PUBLISHING);

/**
 * Marks that an ongoing publishing process has finished.
 */
const finishPublishing = createAction(FINISH_PUBLISHING);

/**
 * Marks an ongoing discarding process.
 */
const startDiscarding = createAction(START_DISCARDING);

/**
 * Marks that an ongoing discarding process has finished.
 */
const finishDiscarding = createAction(FINISH_DISCARDING);

//
// Export the actions
//
export const actions = {
    startSaving,
    finishSaving,
    startPublishing,
    finishPublishing,
    startDiscarding,
    finishDiscarding
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.remote',
        new Map({
            isSaving: false,
            isPublishing: false,
            isDiscarding: false
        })
    ),
    [START_SAVING]: () => $set('ui.remote.isSaving', true),
    [FINISH_SAVING]: () => $set('ui.remote.isSaving', false),
    [START_PUBLISHING]: () => $set('ui.remote.isPublishing', true),
    [FINISH_PUBLISHING]: () => $set('ui.remote.isPublishing', false),
    [START_DISCARDING]: () => $set('ui.remote.isDiscarding', true),
    [FINISH_DISCARDING]: () => $set('ui.remote.isDiscarding', false)
});

//
// Export the selectors
//
export const selectors = {};
