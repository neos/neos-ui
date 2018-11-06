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

const defaultState: State = {
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    otherName: '',
    fullName: ''
};

export const actionTypes = {};
export const actions = {};

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction) => produce(state, draft => {
    switch (action.type) {
        case system.INIT:
            draft.title = state.title || '';
            draft.firstName = state.firstName || '';
            draft.middleName = state.middleName || '';
            draft.lastName = state.lastName || '';
            draft.otherName = state.otherName || '';
            draft.fullName = state.fullName || '';
            break;
    }
});

//
// Export the selectors
//
export const selectors = {};
