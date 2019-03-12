import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get} from 'plow-js';

import {actionTypes as system, InitAction} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isHidden: boolean;
    collapsedMenuGroups: string[];
}> {}

export const defaultState: State = {
    isHidden: false,
    collapsedMenuGroups: ['content']
};

//
// Export the action types
//
export enum actionTypes {
    TOGGLE = '@neos/neos-ui/UI/Drawer/TOGGLE',
    HIDE = '@neos/neos-ui/UI/Drawer/HIDE',
    TOGGLE_MENU_GROUP = '@neos/neos-ui/UI/Drawer/TOGGLE_MENU_GROUP'
}

/**
 * Toggles the off canvas menu out/in of the users viewport.
 */
const toggle = () => createAction(actionTypes.TOGGLE);

/**
 * Hides the off canvas menu.
 */
const hide = () => createAction(actionTypes.HIDE);

/**
 * Toggles collapsed state of a menu group.
 */
const toggleMenuGroup = (menuGroup: string) => createAction(actionTypes.TOGGLE_MENU_GROUP, menuGroup);

//
// Export the actions
//
export const actions = {
    toggle,
    hide,
    toggleMenuGroup
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.isHidden = $get(['payload', 'ui', 'drawer', 'isHidden'], action) || false;
            draft.collapsedMenuGroups = $get(['payload', 'ui', 'drawer', 'collapsedMenuGroups'], action) || ['content'];
            break;
        }
        case actionTypes.TOGGLE: {
            draft.isHidden = !draft.isHidden;
            break;
        }
        case actionTypes.HIDE: {
            draft.isHidden = true;
            break;
        }
        case actionTypes.TOGGLE_MENU_GROUP: {
            const groupId = action.payload;
            if (draft.collapsedMenuGroups.includes(groupId)) {
                draft.collapsedMenuGroups = draft.collapsedMenuGroups.filter(i => i !== groupId);
            } else {
                draft.collapsedMenuGroups.push(groupId);
            }
            break;
        }
    }
});

//
// Export the selectors
//
export const selectors = {};
