import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get} from 'plow-js';

import {InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isOpen: boolean,
    numberOfParentNodesToBeCreated: number
}> {}

export const defaultState: State = {
    isOpen: false,
    numberOfParentNodesToBeCreated: 0
};

//
// Export the action types
//
export enum actionTypes {
    OPEN = '@neos/neos-ui/UI/NodeVariantCreationDialog/OPEN',
    CANCEL = '@neos/neos-ui/UI/NodeVariantCreationDialog/CANCEL',
    CREATE_EMPTY = '@neos/neos-ui/UI/NodeVariantCreationDialog/CREATE_EMPTY',
    CREATE_AND_COPY = '@neos/neos-ui/UI/NodeVariantCreationDialog/CREATE_AND_COPY'
}

const open = (numberOfParentNodesToBeCreated: number) => createAction(actionTypes.OPEN, {numberOfParentNodesToBeCreated});
const cancel = () => createAction(actionTypes.CANCEL);
const createEmpty = () => createAction(actionTypes.CREATE_EMPTY);
const createAndCopy = () => createAction(actionTypes.CREATE_AND_COPY);

//
// Export the actions
//
export const actions = {
    open,
    cancel,
    createEmpty,
    createAndCopy
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.OPEN: {
            draft.isOpen = true;
            draft.numberOfParentNodesToBeCreated = action.payload.numberOfParentNodesToBeCreated;
            break;
        }
        case actionTypes.CANCEL: {
            draft.isOpen = false;
            draft.numberOfParentNodesToBeCreated = 0;
            break;
        }
        case actionTypes.CREATE_EMPTY: {
            draft.isOpen = false;
            break;
        }
        case actionTypes.CREATE_AND_COPY: {
            draft.isOpen = false;
            break;
        }
    }
});

export const selectors = {
    isOpen: (state: GlobalState) => $get(['ui', 'nodeVariantCreationDialog', 'isOpen'], state),
    numberOfParentNodesToBeCreated: (state: GlobalState) => $get(['ui', 'nodeVariantCreationDialog', 'numberOfParentNodesToBeCreated'], state),
};
