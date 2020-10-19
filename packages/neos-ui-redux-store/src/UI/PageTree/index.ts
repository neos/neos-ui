import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {actionTypes as system, InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath, SelectionModeTypes} from '@neos-project/neos-ts-interfaces';

import * as selectors from './selectors';
import {calculateNewFocusedNodes} from '../../CR/Nodes/helpers';

export interface State extends Readonly<{
    focused: NodeContextPath[];
    toggled: NodeContextPath[];
    hidden: NodeContextPath[];
    intermediate: NodeContextPath[];
    loading: NodeContextPath[];
    errors: NodeContextPath[];
    query: string;
    filterNodeType: string;
}> {}

export const defaultState: State = {
    focused: [],
    toggled: [],
    hidden: [],
    intermediate: [],
    loading: [],
    errors: [],
    query: '',
    filterNodeType: ''
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

const focus = (contextPath: NodeContextPath, _: undefined, selectionMode: SelectionModeTypes = SelectionModeTypes.SINGLE_SELECT) => createAction(actionTypes.FOCUS, {contextPath, selectionMode});
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
export const reducer = (state: State = defaultState, action: InitAction | Action, globalState: GlobalState) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            const contextPath = action.payload.cr.nodes.documentNode || action.payload.cr.nodes.siteNode;
            draft.focused = contextPath ? [contextPath] : [];
            break;
        }
        case actionTypes.FOCUS: {
            const {contextPath, selectionMode} = action.payload;
            const newFocusedNodes = calculateNewFocusedNodes(selectionMode, contextPath, draft.focused, globalState.cr.nodes.byContextPath);
            if (newFocusedNodes) {
                draft.focused = newFocusedNodes;
            }
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
        case actionTypes.COMMENCE_SEARCH: {
            // Store search arguments, to be used during tree reload
            draft.query = action.payload.query;
            draft.filterNodeType = action.payload.filterNodeType;
            break;
        }
    }
});

//
// Export the selectors
//
export {selectors};
