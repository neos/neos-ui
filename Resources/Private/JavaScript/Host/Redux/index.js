import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';

import {
    reducer as ChangesReducer,
    actionTypes as ChangesActionTypes,
    actions as Changes
} from './Changes/index';
import {
    reducer as CRReducer,
    hydrators as CRHydrators,
    actionTypes as CRActionTypes,
    actions as CR
} from './CR/index';
import {
    reducer as SystemReducer,
    actionTypes as SystemActionTypes,
    actions as System
} from './System/index';
import {
    reducer as UIReducer,
    actionTypes as UIActionTypes,
    hydrators as UIHydrators,
    actions as UI
} from './UI/index';
import {
    reducer as UserReducer,
    hydrators as UserHydrators,
    actions as User
} from './User/index';
import sagas from 'Host/Sagas/index';

const reducers = {
    ...ChangesReducer,
    ...CRReducer,
    ...SystemReducer,
    ...UIReducer,
    ...UserReducer
};
const rootReducer = handleActions(reducers);
const devToolsStoreEnhancer = () => typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f;
const sagaMiddleWare = createSagaMiddleware();
const hydrators = [
    ...CRHydrators,
    ...UIHydrators,
    ...UserHydrators
];

//
// Export the store factory
//
export function configureStore({serverState = {}} = {}) {
    const mergedInitialState = hydrators.reduce((state, hydrator) => {
        return hydrator(serverState)(state);
    }, new Map());
    const store = createStore(rootReducer, mergedInitialState, compose(
        applyMiddleware(sagaMiddleWare),
        devToolsStoreEnhancer()
    ));

    //
    // Run all sagas at once
    //
    // TODO: re-evaluate this, since this is a change due to redux-saga 0.10.2 update
    //       which might cause some further conceptual changes to the sagas themselves
    //
    sagas.forEach(sagaMiddleWare.run);

    return store;
}

//
// Export the action types
//
export const actionTypes = {
    System: SystemActionTypes,
    Changes: ChangesActionTypes,
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
