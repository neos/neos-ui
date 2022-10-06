import {produce} from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {InitAction} from '../../System';
import { WritableDraft } from 'immer/dist/internal';

export interface ImpersonateAccount extends WritableDraft<{
    accountIdentifier: string;
    fullName: string;
}> {}

export interface State extends Readonly<{
    status: boolean;
    user?: ImpersonateAccount;
    origin?: ImpersonateAccount;
}> {}

export const defaultState: State = {
    status: false
};


//
// Export the action types
//
export enum actionTypes {
    INIT = '@neos/neos-ui/User/Impersonate/INIT',
    FETCH_STATUS = '@neos/neos-ui/User/Impersonate/FETCH_STATUS',
    RESTORE = '@neos/neos-ui/User/Impersonate/RESTORE',
}

//
// Export the actions
//
export const actions = {
    init: () => createAction(actionTypes.INIT),
    fetchStatus: (data: State) => createAction(actionTypes.FETCH_STATUS, data),
    restore: () => createAction(actionTypes.RESTORE),
};

//
// Export the union type of all actions
//
export type Action = ActionType<typeof actions>;

export const reducer = (state: State = defaultState, action: Action | InitAction) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.INIT:
            draft.status = false;
            break;
        case actionTypes.FETCH_STATUS:
            draft.status = action.payload.status;
            draft.user = action.payload.user;
            draft.origin = action.payload.origin;
            break;
        case actionTypes.RESTORE:
            draft.status = false;
            break;
    }
});

//
// Export the selectors
//
export const selectors = {};
