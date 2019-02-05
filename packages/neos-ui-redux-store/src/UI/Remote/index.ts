import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

export interface State extends Readonly<{
    isSaving: boolean,
    isPublishing: boolean,
    isDiscarding: boolean
}> {}

export const defaultState: State = {
    isSaving: false,
    isPublishing: false,
    isDiscarding: false
};

//
// Export the action types
//
export enum actionTypes {
    START_SAVING = '@neos/neos-ui/UI/Remote/START_SAVING',
    FINISH_SAVING = '@neos/neos-ui/UI/Remote/FINISH_SAVING',
    START_PUBLISHING = '@neos/neos-ui/UI/Remote/START_PUBLISHING',
    FINISH_PUBLISHING = '@neos/neos-ui/UI/Remote/FINISH_PUBLISHING',
    START_DISCARDING = '@neos/neos-ui/UI/Remote/START_DISCARDING',
    FINISH_DISCARDING = '@neos/neos-ui/UI/Remote/FINISH_DISCARDING',
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
 * Marks an ongoing publishing process.
 */
const startPublishing = () => createAction(actionTypes.START_PUBLISHING);

/**
 * Marks that an ongoing publishing process has finished.
 */
const finishPublishing = () => createAction(actionTypes.FINISH_PUBLISHING);

/**
 * Marks an ongoing discarding process.
 */
const startDiscarding = () => createAction(actionTypes.START_DISCARDING);

/**
 * Marks that an ongoing discarding process has finished.
 */
const finishDiscarding = () => createAction(actionTypes.FINISH_DISCARDING);

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
    startPublishing,
    finishPublishing,
    startDiscarding,
    finishDiscarding,
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
        case actionTypes.START_PUBLISHING: {
            draft.isPublishing = true;
            break;
        }
        case actionTypes.FINISH_PUBLISHING: {
            draft.isPublishing = false;
            break;
        }
        case actionTypes.START_DISCARDING: {
            draft.isDiscarding = true;
            break;
        }
        case actionTypes.FINISH_DISCARDING: {
            draft.isDiscarding = false;
            break;
        }
    }
});

//
// Export the selectors
//
export const selectors = {};
