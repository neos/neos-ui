import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isOpen: boolean;
    label: string;
    configuration: {} | null;
    parentNodeContextPath: string
    nodeType: string
}> {}

export const defaultState: State = {
    isOpen: false,
    label: '',
    configuration: null,
    parentNodeContextPath: '',
    nodeType: ''
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

type Value = any;
type SaveHookIdentifier = string;
type SaveHookOptions = any;
type SaveHooksMap = {
    [saveHookIdentifier in SaveHookIdentifier]: SaveHookOptions
};
interface TransientValue {
    value: Value;
    hooks?: SaveHooksMap;
}
interface TransientValuesMap {
    [elementName: string]: TransientValue;
}

const open = (label: string, configuration: {}, parentNodeContextPath: string, nodeType: string) => createAction(actionTypes.OPEN, {label, configuration, parentNodeContextPath, nodeType});
const back = () => createAction(actionTypes.BACK);
const cancel = () => createAction(actionTypes.CANCEL);
const apply = (transientValues: TransientValuesMap) => createAction(actionTypes.APPLY, transientValues);

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
            draft.parentNodeContextPath = action.payload.parentNodeContextPath
            draft.nodeType = action.payload.nodeType
            break;
        }
        case actionTypes.BACK: {
            draft.isOpen = false;
            draft.label = '';
            draft.configuration = null;
            draft.parentNodeContextPath = '';
            draft.nodeType = '';
            break;
        }
        case actionTypes.CANCEL: {
            draft.isOpen = false;
            draft.label = '';
            draft.configuration = null;
            draft.parentNodeContextPath = '';
            draft.nodeType = '';
            break;
        }
        case actionTypes.APPLY: {
            draft.isOpen = false;
            draft.label = '';
            draft.configuration = null;
            draft.parentNodeContextPath = '';
            draft.nodeType = '';
            break;
        }
    }
});

export const selectors = {};
