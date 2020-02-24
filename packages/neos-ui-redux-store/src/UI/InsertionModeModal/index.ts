import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

// For some reason this doesn't work:
// import {actionTypes as NodeActionTypes} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/index'
// type OperationType = NodeActionTypes.COPY | NodeActionTypes.MOVE | NodeActionTypes.CUT;

export interface State extends Readonly<{
    isOpen: boolean;
    subjectContextPaths: NodeContextPath[];
    referenceContextPath: NodeContextPath | null;
    enableAlongsideModes: boolean;
    enableIntoMode: boolean;
    operationType: string | null;
}> {}

export const defaultState: State = {
    isOpen: false,
    subjectContextPaths: [],
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
    subjectContextPaths: NodeContextPath[],
    referenceContextPath: NodeContextPath,
    enableAlongsideModes: boolean,
    enableIntoMode: boolean,
    operationType: string
) => createAction(actionTypes.OPEN, {
    subjectContextPaths,
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
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.OPEN: {
            draft.isOpen = true;
            draft.subjectContextPaths = action.payload.subjectContextPaths;
            draft.referenceContextPath = action.payload.referenceContextPath;
            draft.enableAlongsideModes = action.payload.enableAlongsideModes;
            draft.enableIntoMode = action.payload.enableIntoMode;
            draft.operationType = action.payload.operationType;
            break;
        }
        case actionTypes.CANCEL: {
            draft.isOpen = false;
            draft.subjectContextPaths = [];
            draft.referenceContextPath = null;
            draft.enableAlongsideModes = false;
            draft.enableIntoMode = false;
            break;
        }
        case actionTypes.APPLY: {
            draft.isOpen = false;
            draft.subjectContextPaths = [];
            draft.referenceContextPath = null;
            draft.enableAlongsideModes = false;
            draft.enableIntoMode = false;
            break;
        }
    }
});

export const selectors = {};
