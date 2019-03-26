import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isOpen: boolean;
    label: string;
    configuration: {} | null;
}> {}

export const defaultState: State = {
    isOpen: false,
    label: '',
    configuration: null
};

//
// Export the action types
//
export enum actionTypes {
    OPEN = '@neos/neos-ui/UI/NodeCreationDialog/OPEN',
    BACK = '@neos/neos-ui/UI/NodeCreationDialog/BACK',
    CANCEL = '@neos/neos-ui/UI/NodeCreationDialog/CANCEL',
    APPLY = '@neos/neos-ui/UI/NodeCreationDialog/APPLY'
}

const open = (label: string, configuration: {}) => createAction(actionTypes.OPEN, {label, configuration});
const back = () => createAction(actionTypes.BACK);
const cancel = () => createAction(actionTypes.CANCEL);
const apply = (data: {}) => createAction(actionTypes.APPLY, data);

//
// Export the actions
//
export const actions = {
    open,
    back,
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
            draft.label = action.payload.label;
            draft.configuration = action.payload.configuration;
            break;
        }
        case actionTypes.BACK: {
            draft.isOpen = false;
            draft.label = '';
            draft.configuration = null;
            break;
        }
        case actionTypes.CANCEL: {
            draft.isOpen = false;
            draft.label = '';
            draft.configuration = null;
            break;
        }
        case actionTypes.APPLY: {
            draft.isOpen = false;
            draft.label = '';
            draft.configuration = null;
            break;
        }
    }
});

export const selectors = {};
