import {createAction} from 'redux-actions';
import {Map, Set} from 'immutable';
import {$toggle, $set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const TOGGLE = '@neos/neos-ui/UI/ContentTree/TOGGLE';
const START_LOADING = '@neos/neos-ui/UI/ContentTree/START_LOADING';
const STOP_LOADING = '@neos/neos-ui/UI/ContentTree/STOP_LOADING';
const RELOAD_TREE = '@neos/neos-ui/UI/ContentTree/RELOAD_TREE';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE,
    START_LOADING,
    STOP_LOADING,
    RELOAD_TREE
};

const toggle = createAction(TOGGLE, contextPath => ({contextPath}));
const startLoading = createAction(START_LOADING);
const stopLoading = createAction(STOP_LOADING);
const reloadTree = createAction(RELOAD_TREE);

//
// Export the actions
//
export const actions = {
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
            toggled: new Set(),
            isLoading: false
        })
    ),
    [START_LOADING]: () => $set('ui.contentTree.isLoading', true),
    [STOP_LOADING]: () => $set('ui.contentTree.isLoading', false),
    [TOGGLE]: ({contextPath}) => $toggle('ui.contentTree.toggled', contextPath)
});

//
// Export the selectors
//
export {selectors};
