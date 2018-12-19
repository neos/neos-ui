import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {actionTypes as system, InitAction} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

import * as selectors from './selectors';

export interface State extends Readonly<{
    isFocused: NodeContextPath | null;
    toggled: NodeContextPath[];
    hidden: NodeContextPath[];
    intermediate: NodeContextPath[];
    loading: NodeContextPath[];
    errors: NodeContextPath[];
}> {}

export const defaultState: State = {
    isFocused: null,
    toggled: [],
    hidden: [],
    intermediate: [],
    loading: [],
    errors: []
};

//
// Export the action types
//
export enum actionTypes {
    FOCUS = '@neos/neos-ui/UI/PageTree/FOCUS',
    TOGGLE = '@neos/neos-ui/UI/PageTree/TOGGLE',
    INVALIDATE = '@neos/neos-ui/UI/PageTree/INVALIDATE',
    SET_AS_LOADING = '@neos/neos-ui/UI/PageTree/SET_AS_LOADING',
    SET_AS_LOADED = '@neos/neos-ui/UI/PageTree/SET_AS_LOADED',
    REQUEST_CHILDREN = '@neos/neos-ui/UI/PageTree/REQUEST_CHILDREN',
    COMMENCE_SEARCH = '@neos/neos-ui/UI/PageTree/COMMENCE_SEARCH',
    SET_SEARCH_RESULT = '@neos/neos-ui/UI/PageTree/SET_SEARCH_RESULT'
}

const focus = (contextPath: NodeContextPath) => createAction(actionTypes.FOCUS, {contextPath});
const toggle = (contextPath: NodeContextPath) => createAction(actionTypes.TOGGLE, {contextPath});
const invalidate = (contextPath: NodeContextPath) => createAction(actionTypes.INVALIDATE, {contextPath});
const requestChildren = (contextPath: NodeContextPath, {unCollapse = true, activate = false} = {}) =>  createAction(actionTypes.REQUEST_CHILDREN, {contextPath, opts: {unCollapse, activate}});
const setAsLoading = (contextPath: NodeContextPath) => createAction(actionTypes.SET_AS_LOADING, {contextPath});
const setAsLoaded = (contextPath: NodeContextPath) => createAction(actionTypes.SET_AS_LOADED, {contextPath});
interface CommenceSearchOptions extends Readonly<{
    query: string;
    filterNodeType: string;
}> {}
const commenceSearch = (contextPath: NodeContextPath, {query, filterNodeType}: CommenceSearchOptions) => createAction(actionTypes.COMMENCE_SEARCH, {contextPath, query, filterNodeType});
interface SearchResult extends Readonly<{
    hiddenContextPaths: NodeContextPath[];
    toggledContextPaths: NodeContextPath[];
    intermediateContextPaths: NodeContextPath[];
}> {}
const setSearchResult = (result: SearchResult) => createAction(actionTypes.SET_SEARCH_RESULT, result);

//
// Export the actions
//
export const actions = {
    focus,
    toggle,
    invalidate,
    setAsLoading,
    setAsLoaded,
    requestChildren,
    commenceSearch,
    setSearchResult
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.isFocused = action.payload.cr.nodes.documentNode || action.payload.cr.nodes.siteNode || null;
            break;
        }
        case actionTypes.FOCUS: {
            draft.isFocused = action.payload.contextPath;
            break;
        }
        case actionTypes.TOGGLE: {
            const contextPath = action.payload.contextPath;
            if (draft.toggled.includes(contextPath)) {
                draft.toggled = draft.toggled.filter(i => i !== contextPath);
            } else {
                draft.toggled.push(contextPath);
            }
            break;
        }
        case actionTypes.INVALIDATE: {
            const contextPath = action.payload.contextPath;
            draft.toggled = draft.toggled.filter(i => i !== contextPath);
            draft.loading = draft.loading.filter(i => i !== contextPath);
            draft.errors.push(contextPath);
            break;
        }
        case actionTypes.SET_AS_LOADING: {
            const contextPath = action.payload.contextPath;
            draft.errors = draft.errors.filter(i => i !== contextPath);
            draft.loading.push(contextPath);
            break;
        }
        case actionTypes.SET_AS_LOADED: {
            const contextPath = action.payload.contextPath;
            draft.loading = draft.loading.filter(i => i !== contextPath);
            break;
        }
        case actionTypes.SET_SEARCH_RESULT: {
            draft.hidden = action.payload.hiddenContextPaths;
            draft.toggled = action.payload.toggledContextPaths;
            draft.intermediate = action.payload.intermediateContextPaths;
            break;
        }
    }
});

//
// Export the selectors
//
export {selectors};
