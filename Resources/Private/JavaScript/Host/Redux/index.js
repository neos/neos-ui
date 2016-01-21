import compose from 'lodash.compose';
import {
    combineReducers,
    createStore
} from 'redux';

import TransientReducer, * as Transient from './Transient/';
import UIReducer, * as UI from './UI/';
import UserReducer, * as User from './User/';

const reducers = Object.assign(
    {},
    TransientReducer,
    UIReducer,
    UserReducer
);

const rootReducer = combineReducers(reducers);

//
// Middleware you want to use in development:
// Required! Enable Redux DevTools with the monitors you chose
//
// function devToolsMiddleware() {
//     return window.devToolsExtension ? window.devToolsExtension() : () => () => null;
// }

export function configureStore({serverState = {}} = {}) {
    const finalCreateStore = compose(
        typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
            window.devToolsExtension() :
            f => f
    )(createStore);

    return finalCreateStore(rootReducer, serverState);
}

// Export Actions
export const actions = {
    Transient,
    UI,
    User
};
