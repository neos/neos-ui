import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$set} = immutableOperations;

const START_SAVING = '@packagefactory/guevara/UI/Remote/START_SAVING';
const FINISH_SAVING = '@packagefactory/guevara/UI/Remote/FINISH_SAVING';
const START_PUBLISHING = '@packagefactory/guevara/UI/Remote/START_PUBLISHING';
const FINISH_PUBLISHING = '@packagefactory/guevara/UI/Remote/FINISH_PUBLISHING';
const START_DISCARDING = '@packagefactory/guevara/UI/Remote/START_DISCARDING';
const FINISH_DISCARDING = '@packagefactory/guevara/UI/Remote/FINISH_DISCARDING';

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
const initialState = Immutable.fromJS({
    isSaving: false,
    isPublishing: false,
    isDiscarding: false
});

export const reducer = handleActions({
    [START_SAVING]: state => $set(state, 'isSaving', true),
    [FINISH_SAVING]: state => $set(state, 'isSaving', false),
    [START_PUBLISHING]: state => $set(state, 'isPublishing', true),
    [FINISH_PUBLISHING]: state => $set(state, 'isPublishing', false),
    [START_DISCARDING]: state => $set(state, 'isDiscarding', true),
    [FINISH_DISCARDING]: state => $set(state, 'isDiscarding', false)
}, initialState);
