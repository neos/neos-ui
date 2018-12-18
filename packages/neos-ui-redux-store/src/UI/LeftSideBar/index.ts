import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get, $set} from 'plow-js';

import {actionTypes as system, InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isHidden: boolean;
    contentTree: {
        isHidden: boolean;
    };
}> {}

export const defaultState: State = {
    isHidden: false,
    contentTree: {
        isHidden: false
    }
};



//
// Export the action types
//
export enum actionTypes {
    TOGGLE = '@neos/neos-ui/UI/LeftSideBar/TOGGLE',
    TOGGLE_CONTENT_TREE = '@neos/neos-ui/UI/LeftSideBar/TOGGLE_CONTENT_TREE'
}

/**
 * Toggles the left sidebar out/in of the users viewport.
 */
const toggle = () => createAction(actionTypes.TOGGLE);
const toggleContentTree = () => createAction(actionTypes.TOGGLE_CONTENT_TREE);

//
// Export the actions
//
export const actions = {
    toggle,
    toggleContentTree
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const subReducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.isHidden = $get(['payload', 'ui', 'leftSideBar', 'isHidden'], action) || false;
            draft.contentTree.isHidden = $get(['payload', 'ui', 'leftSideBar', 'contentTree', 'isHidden'], action) || false;
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
    }
});

export const reducer = (globalState: GlobalState, action: InitAction | Action) => {
    // TODO: substitute global state with State when conversion of all UI reducers is done
    const state = $get(['ui', 'leftSideBar'], globalState) || undefined;
    const newState = subReducer(state, action);
    return $set(['ui', 'leftSideBar'], newState, globalState);
};

//
// Export the selectors
//
export const selectors = {};
