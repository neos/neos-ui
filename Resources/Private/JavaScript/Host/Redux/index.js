import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';

import {handleActions} from 'Host/Util/HandleActions/';

import {
    reducer as ChangesReducer,
    initialState as ChangesInitialState,
    actions as Changes
} from './Changes/';
import {
    reducer as CRReducer,
    initialState as CRInitialState,
    actionTypes as CRActionTypes,
    actions as CR
} from './CR/';
import {
    reducer as SystemReducer,
    initialState as SystemInitialState,
    actionTypes as SystemActionTypes,
    actions as System
} from './System/';
import {
    reducer as UIReducer,
    initialState as UIInitialState,
    actionTypes as UIActionTypes,
    actions as UI
} from './UI/';
import {
    reducer as UserReducer,
    initialState as UserInitialState,
    actions as User
} from './User/';
import sagas from './Sagas/';

const reducers = {
    ...ChangesReducer,
    ...CRReducer,
    ...SystemReducer,
    ...UIReducer,
    ...UserReducer
};
const rootReducer = handleActions(reducers);
const devToolsStoreEnhancer = () => typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f;
const sagaMiddleWare = createSagaMiddleware(...sagas);
const initialState = {
    changes: ChangesInitialState,
    cr: CRInitialState,
    system: SystemInitialState,
    ui: UIInitialState,
    user: UserInitialState
};

//
// Export the store factory
//
export function configureStore({serverState = {}} = {}) {
    return createStore(rootReducer, Object.assign(initialState, serverState), compose(
        applyMiddleware(sagaMiddleWare),
        devToolsStoreEnhancer()
    ));
}

//
// Export the action types
//
export const actionTypes = {
    System: SystemActionTypes,
    UI: UIActionTypes,
    CR: CRActionTypes
};

//
// Export the actions
//
export const actions = {
    Changes,
    CR,
    System,
    UI,
    User
};
