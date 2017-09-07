import {createAction} from 'redux-actions';
import {Map, Set} from 'immutable';
import {$all, $get, $set, $remove, $add, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const FOCUS = '@neos/neos-ui/UI/PageTree/FOCUS';
const TOGGLE = '@neos/neos-ui/UI/PageTree/TOGGLE';
const INVALIDATE = '@neos/neos-ui/UI/PageTree/INVALIDATE';
const SET_AS_LOADING = '@neos/neos-ui/UI/PageTree/SET_AS_LOADING';
const SET_AS_LOADED = '@neos/neos-ui/UI/PageTree/SET_AS_LOADED';
const REQUEST_CHILDREN = '@neos/neos-ui/UI/PageTree/REQUEST_CHILDREN';
const RELOAD_TREE = '@neos/neos-ui/UI/PageTree/RELOAD_TREE';
const COMMENCE_SEARCH = '@neos/neos-ui/UI/PageTree/COMMENCE_SEARCH';
const SET_SEARCH_RESULT = '@neos/neos-ui/UI/PageTree/SET_SEARCH_RESULT';
//
// Export the action types
//
export const actionTypes = {
    FOCUS,
    TOGGLE,
    INVALIDATE,
    SET_AS_LOADING,
    SET_AS_LOADED,
    REQUEST_CHILDREN,
    RELOAD_TREE,
    COMMENCE_SEARCH,
    SET_SEARCH_RESULT
};

const focus = createAction(FOCUS, contextPath => ({contextPath}));
const toggle = createAction(TOGGLE, contextPath => ({contextPath}));
const invalidate = createAction(INVALIDATE, contextPath => ({contextPath}));
const requestChildren = createAction(REQUEST_CHILDREN, (contextPath, {unCollapse = true, activate = false} = {}) => ({contextPath, opts: {unCollapse, activate}}));
const setAsLoading = createAction(SET_AS_LOADING, contextPath => ({contextPath}));
const setAsLoaded = createAction(SET_AS_LOADED, contextPath => ({contextPath}));
const reloadTree = createAction(RELOAD_TREE);
const commenceSearch = createAction(COMMENCE_SEARCH, (contextPath, {query}) => ({contextPath, query}));
const setSearchResult = createAction(SET_SEARCH_RESULT, result => (result));

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
    reloadTree,
    commenceSearch,
    setSearchResult
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'ui.pageTree',
        new Map({
            isFocused: $get('ui.contentCanvas.contextPath', state) || $get('cr.nodes.siteNode', state),
            toggled: new Set(),
            hidden: new Set(),
            intermediate: new Set(),
            loading: new Set(),
            errors: new Set()
        })
    ),
    [FOCUS]: ({contextPath}) => $set('ui.pageTree.isFocused', contextPath),
    [TOGGLE]: ({contextPath}) => $toggle('ui.pageTree.toggled', contextPath),
    [INVALIDATE]: ({contextPath}) => $all(
        $remove('ui.pageTree.toggled', contextPath),
        $remove('ui.pageTree.loading', contextPath),
        $add('ui.pageTree.errors', contextPath)
    ),
    [SET_AS_LOADING]: ({contextPath}) => $all(
        $remove('ui.pageTree.errors', contextPath),
        $add('ui.pageTree.loading', contextPath)
    ),
    [SET_AS_LOADED]: ({contextPath}) => $all(
        $remove('ui.pageTree.loading', contextPath)
    ),
    [COMMENCE_SEARCH]: ({query}) => state => {
        if (!query) {
            return $all(
              $set('ui.pageTree.hidden', new Set()),
              $set('ui.pageTree.intermediate', new Set()),
              $set('ui.pageTree.toggled', new Set())
            )(state);
        }

        const hiddenContextPaths = new Set([...$get('cr.nodes.byContextPath', state).keys()]);

        return $all(
          $set('ui.pageTree.hidden', hiddenContextPaths.delete($get('cr.nodes.siteNode', state))),
          $set('ui.pageTree.toggled', new Set())
        )(state);
    },
    [SET_SEARCH_RESULT]: result => $all(
        $set('ui.pageTree.hidden', result.hiddenContextPaths),
        $set('ui.pageTree.toggled', new Set(result.toggledContextPaths)),
        $set('ui.pageTree.intermediate', new Set(result.intermediateContextPaths))
    )
});

//
// Export the selectors
//
export {selectors};
