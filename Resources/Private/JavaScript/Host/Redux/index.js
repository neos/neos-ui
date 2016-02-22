import {createStore} from 'redux';

import {handleActions} from 'Host/Util/HandleActions/';

import {
    reducer as ChangesReducer,
    initialState as ChangesInitialState,
    actions as Changes
} from './Changes/';
import {
    reducer as CRReducer,
    initialState as CRInitialState,
    actions as CR
} from './CR/';
import {
    reducer as UIReducer,
    initialState as UIInitialState,
    actions as UI
} from './UI/';
import {
    reducer as UserReducer,
    initialState as UserInitialState,
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
const initialState = {
    changes: ChangesInitialState,
    cr: CRInitialState,
    ui: UIInitialState,
    user: UserInitialState
};

//
// Export the store factory
//
export function configureStore({serverState = {}} = {}) {
    return createStore(rootReducer, Object.assign(initialState, serverState), devToolsStoreEnhancer());
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
