import {actionTypes as system, InitAction} from '../../System';
import {produce} from 'immer';

//
// Export the subreducer state shape interface
//
export interface State extends Readonly<{
    interfaceLanguage: string;
}> {}

export const defaultState: State = {
    interfaceLanguage: ''
};

export enum actionTypes {}
export const actions = {};

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction) => produce(state, draft => {
    switch (action.type) {
        case system.INIT:
            draft.interfaceLanguage = action.payload.user.preferences.interfaceLanguage;
            break;
    }
});

//
// Export the selectors
//
export const selectors = {};
