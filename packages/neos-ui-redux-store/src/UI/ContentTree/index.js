import {createAction} from 'redux-actions';
import {Map, Set} from 'immutable';
import {$toggle, $set, $remove, $add} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';
import {actionTypes as contentCanvas} from '../ContentCanvas/index';

import * as selectors from './selectors';

const UNCOLLAPSE = '@neos/neos-ui/UI/ContentTree/UNCOLLAPSE';
const COLLAPSE = '@neos/neos-ui/UI/ContentTree/COLLAPSE';
const TOGGLE = '@neos/neos-ui/UI/ContentTree/TOGGLE';
const START_LOADING = '@neos/neos-ui/UI/ContentTree/START_LOADING';
const STOP_LOADING = '@neos/neos-ui/UI/ContentTree/STOP_LOADING';
const RELOAD_TREE = '@neos/neos-ui/UI/ContentTree/RELOAD_TREE';

//
// Export the action types
//
export const actionTypes = {
    UNCOLLAPSE,
    COLLAPSE,
    TOGGLE,
    START_LOADING,
    STOP_LOADING,
    RELOAD_TREE
};

const uncollapse = createAction(UNCOLLAPSE, contextPath => ({contextPath}));
const collapse = createAction(COLLAPSE, contextPath => ({contextPath}));
const toggle = createAction(TOGGLE, contextPath => ({contextPath}));
const startLoading = createAction(START_LOADING);
const stopLoading = createAction(STOP_LOADING);
const reloadTree = createAction(RELOAD_TREE);

//
// Export the actions
//
export const actions = {
    uncollapse,
    collapse,
    toggle,
    startLoading,
    stopLoading,
    reloadTree
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.contentTree',
        new Map({
            uncollapsed: new Set(),
            isLoading: false
        })
    ),
    [contentCanvas.SET_CONTEXT_PATH]: ({contextPath}) => $add('ui.contentTree.uncollapsed', contextPath),
    [UNCOLLAPSE]: ({contextPath}) => $add('ui.contentTree.uncollapsed', contextPath),
    [COLLAPSE]: ({contextPath}) => $remove('ui.contentTree.uncollapsed', contextPath),
    [START_LOADING]: () => $set('ui.contentTree.isLoading', true),
    [STOP_LOADING]: () => $set('ui.contentTree.isLoading', false),
    [TOGGLE]: ({contextPath}) => $toggle('ui.contentTree.uncollapsed', contextPath)
});

//
// Export the selectors
//
export {selectors};
