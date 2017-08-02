import {createAction} from 'redux-actions';
import {Map, Set} from 'immutable';
import {$all, $get, $set, $remove, $add} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const FOCUS = '@neos/neos-ui/UI/PageTree/FOCUS';
const COMMENCE_UNCOLLAPSE = '@neos/neos-ui/UI/PageTree/COMMENCE_UNCOLLAPSE';
const UNCOLLAPSE = '@neos/neos-ui/UI/PageTree/UNCOLLAPSE';
const COLLAPSE = '@neos/neos-ui/UI/PageTree/COLLAPSE';
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
    COMMENCE_UNCOLLAPSE,
    UNCOLLAPSE,
    COLLAPSE,
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
const commenceUncollapse = createAction(COMMENCE_UNCOLLAPSE, contextPath => ({contextPath}));
const uncollapse = createAction(UNCOLLAPSE, contextPath => ({contextPath}));
const collapse = createAction(COLLAPSE, contextPath => ({contextPath}));
const toggle = createAction(TOGGLE, contextPath => ({contextPath}));
const invalidate = createAction(INVALIDATE, contextPath => ({contextPath}));
const requestChildren = createAction(REQUEST_CHILDREN, (contextPath, {unCollapse = true, activate = false} = {}) => ({contextPath, opts: {unCollapse, activate}}));
const setAsLoading = createAction(SET_AS_LOADING, contextPath => ({contextPath}));
const setAsLoaded = createAction(SET_AS_LOADED, contextPath => ({contextPath}));
const reloadTree = createAction(RELOAD_TREE);
const commenceSearch = createAction(COMMENCE_SEARCH, (contextPath, {query}) => ({contextPath, query}));
const setSearchResult = createAction(SET_SEARCH_RESULT, nodes => ({nodes}));

//
// Export the actions
//
export const actions = {
    focus,
    commenceUncollapse,
    uncollapse,
    collapse,
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
            uncollapsed: new Set([$get('cr.nodes.siteNode', state)]),
            hidden: new Set(),
            intermediate: new Set(),
            loading: new Set(),
            errors: new Set()
        })
    ),
    [FOCUS]: ({contextPath}) => $set('ui.pageTree.isFocused', contextPath),
    [UNCOLLAPSE]: ({contextPath}) => $all(
        $remove('ui.pageTree.errors', contextPath),
        $remove('ui.pageTree.loading', contextPath),
        $add('ui.pageTree.uncollapsed', contextPath)
    ),
    [COLLAPSE]: ({contextPath}) => $all(
        $remove('ui.pageTree.errors', contextPath),
        $remove('ui.pageTree.loading', contextPath),
        $remove('ui.pageTree.uncollapsed', contextPath)
    ),
    [INVALIDATE]: ({contextPath}) => $all(
        $remove('ui.pageTree.uncollapsed', contextPath),
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
              $set('ui.pageTree.uncollapsed', new Set([$get('cr.nodes.siteNode', state)]))
            )(state);
        }

        const hiddenContextPaths = new Set([...$get('cr.nodes.byContextPath', state).keys()]);

        return $all(
          $set('ui.pageTree.hidden', hiddenContextPaths.delete($get('cr.nodes.siteNode', state))),
          $set('ui.pageTree.uncollapsed', new Set())
        )(state);
    },
    [SET_SEARCH_RESULT]: ({nodes}) => state => {
        const resultContextPaths = new Set(Object.keys(nodes));
        const hiddenContextPaths = $get('ui.pageTree.hidden', state).subtract(resultContextPaths);

        const uncollapsedContextPaths = [];
        const intermediateContextPaths = [];

        Object.keys(nodes).forEach(contextPath => {
            const node = nodes[contextPath];
            if (node.intermediate) {
                uncollapsedContextPaths.push(contextPath);

                if (!node.matched) {
                    intermediateContextPaths.push(contextPath);
                }
            }
        });

        return $all(
          $set('ui.pageTree.hidden', hiddenContextPaths),
          $set('ui.pageTree.uncollapsed', new Set(uncollapsedContextPaths)),
          $set('ui.pageTree.intermediate', new Set(intermediateContextPaths))
        )(state);
    }
});

//
// Export the selectors
//
export {selectors};
