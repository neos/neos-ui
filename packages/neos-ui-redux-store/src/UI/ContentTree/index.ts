import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

import * as selectors from './selectors';

export interface State extends Readonly<{
    toggled: NodeContextPath[];
    isLoading: boolean;
}> {}

export const defaultState: State = {
    toggled: [],
    isLoading: false
};

//
// Export the action types
//
export enum actionTypes {
    TOGGLE = '@neos/neos-ui/UI/ContentTree/TOGGLE',
    START_LOADING = '@neos/neos-ui/UI/ContentTree/START_LOADING',
    STOP_LOADING = '@neos/neos-ui/UI/ContentTree/STOP_LOADING',
    RELOAD_TREE = '@neos/neos-ui/UI/ContentTree/RELOAD_TREE'
}

const toggle = (contextPath: NodeContextPath) => createAction(actionTypes.TOGGLE, contextPath);
const startLoading = () => createAction(actionTypes.START_LOADING);
const stopLoading = () => createAction(actionTypes.STOP_LOADING);
const reloadTree = () => createAction(actionTypes.RELOAD_TREE);

//
// Export the actions
//
export const actions = {
    toggle,
    startLoading,
    stopLoading,
    reloadTree
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.START_LOADING: {
            draft.isLoading = true;
            break;
        }
        case actionTypes.STOP_LOADING: {
            draft.isLoading = false;
            break;
        }
        case actionTypes.TOGGLE: {
            const contextPath = action.payload;
            if (draft.toggled.includes(contextPath)) {
                draft.toggled = draft.toggled.filter(i => i !== contextPath);
            } else {
                draft.toggled.push(contextPath);
            }
            break;
        }
    }
});

//
// Export the selectors
//
export {selectors};
