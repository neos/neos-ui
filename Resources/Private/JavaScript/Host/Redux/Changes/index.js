import {createAction} from 'redux-actions';
import {$all, $add, $set, $get} from 'plow-js';

const ADD = '@packagefactory/guevara/Transient/Changes/ADD';
const FLUSH = '@packagefactory/guevara/Transient/Changes/FLUSH';
const FINISH = '@packagefactory/guevara/Transient/Changes/FINISH';
const FAIL = '@packagefactory/guevara/Transient/Changes/FAIL';
const RETRY = '@packagefactory/guevara/Transient/Changes/RETRY';

//
// Export the action types
//
export const actionTypes = {
    ADD,
    FLUSH,
    FINISH,
    FAIL,
    RETRY
};

/**
 * Adds the given chagnge to the pending changes state.
 * If you want to add a change, use the the ChangeManager API.
 */
const add = createAction(ADD, change => ({change}));

/**
 * Sends all local changes to the server.
 */
const flush = createAction(FLUSH);

/**
 * Clear the changes from `processing` state on succsesfull publishing.
 */
const finish = createAction(FINISH);

/**
 * Move changes from `processing` to `failed` states when publishing fails.
 */
const fail = createAction(FAIL);

/**
 * Move changes from `failed` to `pending` stated to retry publishing.
 */
const retry = createAction(RETRY);

//
// Export the actions
//
export const actions = {
    add,
    flush,
    finish,
    fail,
    retry
};

//
// Export the initial state
//
export const initialState = {
    pending: [],
    processing: [],
    failed: []
};

//
// Export the reducer
//
export const reducer = {
    [ADD]: ({change}) => $add('changes.pending', change),
    [FLUSH]: () => state => $all(
        state => $set('changes.processing',
            [
                ...$get('changes.processing', state),
                ...$get('changes.pending', state)
            ], state),
        state => $set('changes.pending', [], state),
        state
    ),
    [FINISH]: () => state => $set('changes.processing', [], state),
    [FAIL]: () => state => $all(
        state => $set('changes.failed',
            [
                ...$get('changes.failed', state),
                ...$get('changes.processing', state)
            ], state),
        state => $set('changes.processing', [], state),
        state
    ),
    [RETRY]: () => state => $all(
        state => $set('changes.pending',
            [
                ...$get('changes.pending', state),
                ...$get('changes.failed', state)
            ], state),
        state => $set('changes.failed', [], state),
        state
    )
};
