import compose from 'lodash.compose';
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

//
// Export the store factory
//
export function configureStore({serverState = {}} = {}) {
    const finalCreateStore = compose(
        typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
            window.devToolsExtension() :
            f => f
    )(createStore);

    return finalCreateStore(rootReducer, serverState);
}

//
// Export the actions
//
export const actions = {
    Transient,
    UI,
    User
};
