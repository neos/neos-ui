import {createAction} from 'redux-actions';
import {Map} from 'immutable';
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
const toggleContentTree = createAction(TOGGLE_CONTENT_TREE, () => ({}));

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
    [system.INIT]: state => $set(
        'ui.leftSideBar',
        new Map({
            isHidden: $get('ui.leftSideBar.isHidden', state) ? $get('ui.leftSideBar.isHidden', state) : false,
            contentTree: new Map({
                isHidden: $get('ui.leftSideBar.contentTree.isHidden', state) ? $get('ui.leftSideBar.contentTree.isHidden', state) : false
            })
        })
    ),
    [TOGGLE]: () => $toggle('ui.leftSideBar.isHidden'),
    [TOGGLE_CONTENT_TREE]: () => $toggle('ui.leftSideBar.contentTree.isHidden')
});

//
// Export the selectors
//
export const selectors = {};
