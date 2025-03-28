import {action as createAction, ActionType} from 'typesafe-actions';

//
// Export the action types
//
export enum actionTypes {
    ADD = '@neos/neos-ui/UI/FlashMessages/ADD'
}

/**
 * Adds a flash message
 *
 * @param id       Must be unique within the ui.flashMessages portion of the store
 * @param message  The message which will be displayed to in the UI.
 * @param severity
 * @param timeout An (optional) timeout, after which the flash message will disappear
 */
const add = (id: string, message: string, severity: string, timeout: number = 0) => createAction(actionTypes.ADD, ({
    severity,
    id,
    message,
    timeout
}));

//
// Export the actions
//
export const actions = {
    add
};

export type Action = ActionType<typeof actions>;
