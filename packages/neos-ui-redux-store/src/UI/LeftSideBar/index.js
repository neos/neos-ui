import {createAction} from 'redux-actions';
// import Immutable from 'immutable';
import {Map, Set} from 'immutable';
import {$get, $set, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const TOGGLE = '@neos/neos-ui/UI/LeftSideBar/TOGGLE';
const TOGGLE_CONTENT_TREE = '@neos/neos-ui/UI/LeftSideBar/TOGGLE_CONTENT_TREE';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE,
    TOGGLE_CONTENT_TREE
};

/**
 * Toggles the left sidebar out/in of the users viewport.
 */
const toggle = createAction(TOGGLE);
const toggleContentTree = createAction(TOGGLE_CONTENT_TREE);

//
// Export the actions
//
export const actions = {
    toggle,
    toggleContentTree
};

//
// Export the reducer
//
export const reducer = handleActions({
    // [system.INIT]: payload => $set(
    //     'ui.leftSideBar',
    //     Immutable.fromJS($get('ui.leftSideBar', payload) ? $get('ui.leftSideBar', payload) : {isHidden: false, contentTree: {isHidden: false}})
    // ),
    [system.INIT]: state => $set(
        'ui.leftSideBar',
        new Map({
            isHidden: $get('ui.leftSideBar.isHidden', state) ? $get('ui.leftSideBar.isHidden', state) : false,
            isHiddenContentTree: $get('ui.leftSideBar.isHiddenContentTree', state) ? $get('ui.leftSideBar.isHiddenContentTree', state) : false
        })
    ),
    [TOGGLE]: () => $toggle('ui.leftSideBar.isHidden'),
    [TOGGLE_CONTENT_TREE]: () => $toggle('ui.leftSideBar.isHiddenContentTree')
});

//
// Export the selectors
//
export const selectors = {};
