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
 * Should be called once the server informs the client that a node has been created.
 */
const documentNodeCreated = (contextPath: NodeContextPath) => createAction(actionTypes.DOCUMENT_NODE_CREATED, {contextPath});

//
// Export the actions
//
export const actions = {
    startSaving,
    finishSaving,
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
    }
});

//
// Export the selectors
//
export const selectors = {};
