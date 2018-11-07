import {actionTypes as system, InitAction} from '../../System';
import {produce} from 'immer';

//
// Export the subreducer state shape interface
//
export interface State extends Readonly<{
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    otherName: string;
    fullName: string;
}> {}

export const defaultState: State = {
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    otherName: '',
    fullName: ''
};

export enum actionTypes {}
export const actions = {};

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction) => produce(state, draft => {
    switch (action.type) {
        case system.INIT:
            draft.title = action.payload.user.name.title;
            draft.firstName = action.payload.user.name.firstName;
            draft.middleName = action.payload.user.name.middleName;
            draft.lastName = action.payload.user.name.lastName;
            draft.otherName = action.payload.user.name.otherName;
            draft.fullName = action.payload.user.name.fullName;
            break;
    }
});

//
// Export the selectors
//
export const selectors = {};
