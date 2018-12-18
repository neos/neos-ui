import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get, $set} from 'plow-js';

import {InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

// For some reason this doesn't work:
// import {actionTypes as NodeActionTypes} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/index'
// type OperationType = NodeActionTypes.COPY | NodeActionTypes.MOVE | NodeActionTypes.CUT;

export interface State extends Readonly<{
    isOpen: boolean;
    subjectContextPath: NodeContextPath | null;
    referenceContextPath: NodeContextPath | null;
    enableAlongsideModes: boolean;
    enableIntoMode: boolean;
    operationType: string | null;
}> {}

export const defaultState: State = {
    isOpen: false,
    subjectContextPath: null,
    referenceContextPath: null,
    enableAlongsideModes: false,
    enableIntoMode: false,
    operationType: null
};

//
// Export the action types
//
export enum actionTypes {
    OPEN = '@neos/neos-ui/UI/InsertionModeModal/OPEN',
    CANCEL = '@neos/neos-ui/UI/InsertionModeModal/CANCEL',
    APPLY = '@neos/neos-ui/UI/InsertionModeModal/APPLY'
}

const open = (
    subjectContextPath: NodeContextPath,
    referenceContextPath: NodeContextPath,
    enableAlongsideModes: boolean,
    enableIntoMode: boolean,
    operationType: string
) => createAction(actionTypes.OPEN, {
    subjectContextPath,
    referenceContextPath,
    enableAlongsideModes,
    enableIntoMode,
    operationType
});
const cancel = () => createAction(actionTypes.CANCEL);
const apply = (mode: InsertPosition | null) => createAction(actionTypes.APPLY, mode);

//
// Export the actions
//
export const actions = {
    open,
    cancel,
    apply
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const subReducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.OPEN: {
            draft.isOpen = true;
            draft.subjectContextPath = action.payload.subjectContextPath;
            draft.referenceContextPath = action.payload.referenceContextPath;
            draft.enableAlongsideModes = action.payload.enableAlongsideModes;
            draft.enableIntoMode = action.payload.enableIntoMode;
            draft.operationType = action.payload.operationType;
            break;
        }
        case actionTypes.CANCEL: {
            draft.isOpen = false;
            draft.subjectContextPath = null;
            draft.referenceContextPath = null;
            draft.enableAlongsideModes = false;
            draft.enableIntoMode = false;
            break;
        }
        case actionTypes.APPLY: {
            draft.isOpen = false;
            draft.subjectContextPath = null;
            draft.referenceContextPath = null;
            draft.enableAlongsideModes = false;
            draft.enableIntoMode = false;
            break;
        }
    }
});

export const reducer = (globalState: GlobalState, action: InitAction | Action) => {
    // TODO: substitute global state with State when conversion of all UI reducers is done
    const state = $get(['ui', 'insertionModeModal'], globalState) || undefined;
    const newState = subReducer(state, action);
    return $set(['ui', 'insertionModeModal'], newState, globalState);
};
