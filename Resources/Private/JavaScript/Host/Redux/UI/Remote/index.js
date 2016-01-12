import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$set} = immutableOperations;

const START_SAVING = '@packagefactory/guevara/UI/Remote/START_SAVING';
const FINISH_SAVING = '@packagefactory/guevara/UI/Remote/FINISH_SAVING';
const START_PUBLISHING = '@packagefactory/guevara/UI/Remote/START_PUBLISHING';
const FINISH_PUBLISHING = '@packagefactory/guevara/UI/Remote/FINISH_PUBLISHING';
const START_DISCARDING = '@packagefactory/guevara/UI/Remote/START_DISCARDING';
const FINISH_DISCARDING = '@packagefactory/guevara/UI/Remote/FINISH_DISCARDING';

export default handleActions({
    [START_SAVING]: state => $set(state, 'ui.remote.isSaving', true),
    [FINISH_SAVING]: state => $set(state, 'ui.remote.isSaving', false),
    [START_PUBLISHING]: state => $set(state, 'ui.remote.isPublishing', true),
    [FINISH_PUBLISHING]: state => $set(state, 'ui.remote.isPublishing', false),
    [START_DISCARDING]: state => $set(state, 'ui.remote.isDiscarding', true),
    [FINISH_DISCARDING]: state => $set(state, 'ui.remote.isDiscarding', false)
});

/**
 * Marks an ongoing saving process.
 */
export const startSaving = createAction(START_SAVING);

/**
 * Marks that an ongoing saving process has finished.
 */
export const finishSaving = createAction(FINISH_SAVING);

/**
 * Marks an ongoing publishing process.
 */
export const startPublishing = createAction(START_PUBLISHING);

/**
 * Marks that an ongoing publishing process has finished.
 */
export const finishPublishing = createAction(FINISH_PUBLISHING);

/**
 * Marks an ongoing discarding process.
 */
export const startDiscarding = createAction(START_DISCARDING);

/**
 * Marks that an ongoing discarding process has finished.
 */
export const finishDiscarding = createAction(FINISH_DISCARDING);
