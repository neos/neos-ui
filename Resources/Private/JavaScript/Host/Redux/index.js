import compose from 'lodash.compose';
import {eventsMiddleware} from 'Host/Middlewares/';
import {
    combineReducers,
    createStore
} from 'redux';
import {
    reducer as TransientReducer,
    events as TransientEvents,
    actions as Transient
} from './Transient/';
import {
    reducer as UIReducer,
    events as UIEvents,
    actions as UI
} from './UI/';
import {
    reducer as UserReducer,
    events as UserEvents,
    actions as User
} from './User/';

const reducers = Object.assign(
    {},
    TransientReducer,
    UIReducer,
    UserReducer
);
const rootReducer = combineReducers(reducers);
const devToolsMiddleware = () => typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f;

//
// Export the store factory
//
export function configureStore({serverState = {}} = {}) {
    const finalCreateStore = compose(
        devToolsMiddleware(),
        eventsMiddleware()
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

//
// Export the event map
//
export const events = {
    ...TransientEvents,
    ...UIEvents,
    ...UserEvents
};
