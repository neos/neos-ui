import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get} from 'plow-js';

import {actionTypes as system, InitAction} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isHidden: boolean;
    contentTree: {
        isHidden: boolean;
    },
    searchBar:  {
        isVisible: boolean;
    };
}> {}

export const defaultState: State = {
    isHidden: false,
    contentTree: {
        isHidden: false
    },
    searchBar: {
        isVisible: false
    }
};



//
// Export the action types
//
export enum actionTypes {
    TOGGLE = '@neos/neos-ui/UI/LeftSideBar/TOGGLE',
    TOGGLE_CONTENT_TREE = '@neos/neos-ui/UI/LeftSideBar/TOGGLE_CONTENT_TREE',
    TOGGLE_SEARCH_BAR = '@neos/neos-ui/UI/LeftSideBar/TOGGLE_SEARCH_BAR'
}

/**
 * Toggles the left sidebar out/in of the users viewport.
 */
const toggle = () => createAction(actionTypes.TOGGLE);
const toggleContentTree = () => createAction(actionTypes.TOGGLE_CONTENT_TREE);
const toggleSearchBar = () => createAction(actionTypes.TOGGLE_SEARCH_BAR);

//
// Export the actions
//
export const actions = {
    toggle,
    toggleContentTree,
    toggleSearchBar
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.isHidden = $get(['payload', 'ui', 'leftSideBar', 'isHidden'], action) || false;
            draft.contentTree.isHidden = $get(['payload', 'ui', 'leftSideBar', 'contentTree', 'isHidden'], action) || false;
            draft.searchBar.isVisible = $get(['payload', 'ui', 'leftSideBar', 'searchBar', 'isVisible'], action) || false;
            break;
        }
        case actionTypes.TOGGLE: {
            draft.isHidden = !draft.isHidden;
            break;
        }
        case actionTypes.TOGGLE_CONTENT_TREE: {
            draft.contentTree.isHidden = !draft.contentTree.isHidden;
            break;
        }
        case actionTypes.TOGGLE_SEARCH_BAR: {
            draft.searchBar.isVisible = !draft.searchBar.isVisible;
            break;
        }
    }
});

//
// Export the selectors
//
export const selectors = {};
