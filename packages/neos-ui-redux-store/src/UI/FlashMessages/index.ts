import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';

export interface FlashMessage extends Readonly<{
    severity: string;
    id: string;
    message: string;
    timeout: number;
}> {}

export interface State extends Readonly<{
    [propName: string]: FlashMessage;
}> {}

export const defaultState: State = {};

//
// Export the action types
//
export enum actionTypes {
    ADD = '@neos/neos-ui/UI/FlashMessages/ADD',
    REMOVE = '@neos/neos-ui/UI/FlashMessages/REMOVE'
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

/**
 * Removes a flash message
 *
 * @param  {String} id The flashMessage id to delete.
 */
const remove = (id: string) => createAction(actionTypes.REMOVE, ({
    id
}));

//
// Export the actions
//
export const actions = {
    add,
    remove
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.ADD: {
            const message = action.payload;
            const allowedSeverities = ['success', 'error', 'info'];
            const {id, severity} = message;
            const messageContents = message.message;

            if (!id || id.length < 0) {
                throw new Error('Empty or non existent "id" passed to the addFlashMessage reducer. Please specify a string containing a random id.');
            }

            if (!messageContents || messageContents.length < 0) {
                throw new Error('Empty or non existent "message" passed to the addFlashMessage reducer. Please specify a string containing your desired message.');
            }

            if (!severity || allowedSeverities.indexOf(severity.toLowerCase()) < 0) {
                throw new Error(`Invalid "severity" specified while adding a new FlashMessage. Allowed severities are ${allowedSeverities.join(' ')}.`);
            }
            message.severity = message.severity.toLowerCase();
            draft[message.id] = message;
            break;
        }
        case actionTypes.REMOVE: {
            delete draft[action.payload.id];
            break;
        }
    }
});

//
// Export the selectors
//
export const selectors = {};
