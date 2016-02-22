import {createStore} from 'redux';

import {handleActions} from 'Host/Util/HandleActions/';

import {
    reducer as ChangesReducer,
    actions as Changes
} from './Changes/';
import {
    reducer as CRReducer,
    actions as CR
} from './CR/';
import {
    reducer as UIReducer,
    actions as UI
} from './UI/';
import {
    reducer as UserReducer,
    actions as User
} from './User/';

const reducers = {
    ...ChangesReducer,
    ...CRReducer,
    ...UIReducer,
    ...UserReducer
};
const rootReducer = handleActions(reducers);
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
    Changes,
    CR,
    UI,
    User
};
