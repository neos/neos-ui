import {
    combineReducers,
    createStore
} from 'redux';
import {
    reducer as TransientReducer,
    actions as Transient
} from './Transient/';
import {
    reducer as UIReducer,
    actions as UI
} from './UI/';
import {
    reducer as UserReducer,
    actions as User
} from './User/';

const reducers = Object.assign(
    {},
    TransientReducer,
    UIReducer,
    UserReducer
);
const rootReducer = combineReducers(reducers);
const devToolsStoreEnhancer = () => typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f;

//
// Export the store factory
//
export function configureStore({serverState = {}} = {}) {
    return createStore(rootReducer, serverState, devToolsStoreEnhancer());
}

//
// Export the actions
//
export const actions = {
    Transient,
    UI,
    User
};
