import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '../../System';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

import * as selectors from './selectors';

export interface State extends Readonly<{
    toggled: NodeContextPath[];
    isLoading: boolean;
    loading: NodeContextPath[];
    errors: NodeContextPath[];
}> {}

export const defaultState: State = {
    toggled: [],
    isLoading: false,
    loading: [],
    errors: []
};

//
// Export the action types
//
export enum actionTypes {
    TOGGLE = '@neos/neos-ui/UI/ContentTree/TOGGLE',
    START_LOADING = '@neos/neos-ui/UI/ContentTree/START_LOADING',
    STOP_LOADING = '@neos/neos-ui/UI/ContentTree/STOP_LOADING',
    RELOAD_TREE = '@neos/neos-ui/UI/ContentTree/RELOAD_TREE',
    REQUEST_CHILDREN = '@neos/neos-ui/UI/ContentTree/REQUEST_CHILDREN',
    SET_AS_LOADING = '@neos/neos-ui/UI/ContentTree/SET_AS_LOADING',
    SET_AS_LOADED = '@neos/neos-ui/UI/ContentTree/SET_AS_LOADED',
}

const toggle = (contextPath: NodeContextPath) => createAction(actionTypes.TOGGLE, contextPath);
const startLoading = () => createAction(actionTypes.START_LOADING);
const stopLoading = () => createAction(actionTypes.STOP_LOADING);
const reloadTree = () => createAction(actionTypes.RELOAD_TREE);
const requestChildren = (contextPath: NodeContextPath, {unCollapse = true, activate = false} = {}) => createAction(actionTypes.REQUEST_CHILDREN, {contextPath, opts: {unCollapse, activate}});
const setAsLoading = (contextPath: NodeContextPath) => createAction(actionTypes.SET_AS_LOADING, {contextPath});
const setAsLoaded = (contextPath: NodeContextPath) => createAction(actionTypes.SET_AS_LOADED, {contextPath});

//
// Export the actions
//
export const actions = {
    toggle,
    startLoading,
    stopLoading,
    reloadTree,
    requestChildren,
    setAsLoading,
    setAsLoaded
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
        case actionTypes.SET_AS_LOADING: {
            const {contextPath} = action.payload;
            draft.errors = draft.errors.filter(i => i !== contextPath);
            draft.loading.push(contextPath);
            break;
        }
        case actionTypes.SET_AS_LOADED: {
            const {contextPath} = action.payload;
            draft.loading = draft.loading.filter(i => i !== contextPath);
            break;
        }
    }
});

//
// Export the selectors
//
export {selectors};
