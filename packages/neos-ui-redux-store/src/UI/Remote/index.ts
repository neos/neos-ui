import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '../../System';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

export interface State extends Readonly<{
    isSaving: boolean
}> {}

export const defaultState: State = {
    isSaving: false
};

//
// Export the action types
//
export enum actionTypes {
    START_SAVING = '@neos/neos-ui/UI/Remote/START_SAVING',
    FINISH_SAVING = '@neos/neos-ui/UI/Remote/FINISH_SAVING',
    LOCK_PUBLISHING = '@neos/neos-ui/UI/Remote/LOCK_PUBLISHING',
    UNLOCK_PUBLISHING = '@neos/neos-ui/UI/Remote/UNLOCK_PUBLISHING',
    DOCUMENT_NODE_CREATED = '@neos/neos-ui/UI/Remote/DOCUMENT_NODE_CREATED'
}

/**
 * Marks an ongoing saving process.
 */
const startSaving = () => createAction(actionTypes.START_SAVING);

/**
 * Marks that an ongoing saving process has finished.
 */
const finishSaving = () => createAction(actionTypes.FINISH_SAVING);

/**
 * Marks that an publishing process has been locked.
 */
const lockPublishing = () => createAction(actionTypes.LOCK_PUBLISHING);

/**
 * Marks that an publishing process has been unlocked.
 */
const unlockPublishing = () => createAction(actionTypes.UNLOCK_PUBLISHING);

/**
 * Should be called once the server informs the client that a node has been created.
 */
const documentNodeCreated = (contextPath: NodeContextPath) => createAction(actionTypes.DOCUMENT_NODE_CREATED, {contextPath});

//
// Export the actions
//
export const actions = {
    startSaving,
    finishSaving,
    lockPublishing,
    unlockPublishing,
    documentNodeCreated
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.START_SAVING: {
            draft.isSaving = true;
            break;
        }
        case actionTypes.FINISH_SAVING: {
            draft.isSaving = false;
            break;
        }
        case actionTypes.LOCK_PUBLISHING: {
            draft.isSaving = true;
            break;
        }
        case actionTypes.UNLOCK_PUBLISHING: {
            draft.isSaving = false;
            break;
        }
    }
});

//
// Export the selectors
//
export const selectors = {};
