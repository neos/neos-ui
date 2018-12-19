import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath, InsertPosition, NodeTypeName} from '@neos-project/neos-ts-interfaces';

const PREFERRED_MODE_DEFAULT = InsertPosition.AFTER;

export interface State extends Readonly<{
    isOpen: boolean;
    referenceNodeContextPath: NodeContextPath | null;
    preferredMode: InsertPosition;
}> {}

export const defaultState: State = {
    isOpen: false,
    referenceNodeContextPath: null,
    preferredMode: PREFERRED_MODE_DEFAULT
};

//
// Export the action types
//
export enum actionTypes {
    OPEN = '@neos/neos-ui/UI/SelectNodeTypeModal/OPEN',
    CANCEL = '@neos/neos-ui/UI/SelectNodeTypeModal/CANCEL',
    APPLY = '@neos/neos-ui/UI/SelectNodeTypeModal/APPLY'
}

/**
 * Opens the select nodetype modal.
 *
 * @param {string} referenceNodeContextPath ContextPath of the node relative to which the new node ought to be created
 * @param {string} preferredMode (optional) Allows to override the default insertion mode. Currently not used in the system, but useful for extensibility.
 */
const open = (referenceNodeContextPath: NodeContextPath, preferredMode: InsertPosition = PREFERRED_MODE_DEFAULT) => createAction(actionTypes.OPEN, {referenceNodeContextPath, preferredMode});
const cancel = () => createAction(actionTypes.CANCEL);
const apply = (mode: InsertPosition, nodeType: NodeTypeName) => createAction(actionTypes.APPLY, {mode, nodeType});

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
            draft.referenceNodeContextPath = action.payload.referenceNodeContextPath;
            draft.preferredMode = action.payload.preferredMode;
            break;
        }
        case actionTypes.CANCEL: {
            draft.isOpen = false;
            draft.referenceNodeContextPath = null;
            draft.preferredMode = PREFERRED_MODE_DEFAULT;
            break;
        }
        case actionTypes.APPLY: {
            draft.isOpen = false;
            draft.referenceNodeContextPath = null;
            draft.preferredMode = PREFERRED_MODE_DEFAULT;
            break;
        }
    }
});

export const selectors = {};
