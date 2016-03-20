import {createStore} from 'redux';
import merge from 'lodash.merge';

import {handleActions} from 'Shared/Utilities/index';

import {
    reducer as NodeToolbarReducer,
    actionTypes as NodeToolbarActionTypes,
    initialState as NodeToolbarInitialState,
    actions as NodeToolbar
} from './NodeToolbar/index';

const reducers = {
    ...NodeToolbarReducer
};
const rootReducer = handleActions(reducers);
const devToolsStoreEnhancer = () => typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f;
const initialState = {
    nodeToolbar: NodeToolbarInitialState
};

//
// Export the store factory
//
export function configureStore() {
    const mergedInitialState = merge({}, initialState);
    return createStore(rootReducer, mergedInitialState, devToolsStoreEnhancer());
}

//
// Export the action types
//
export const actionTypes = {
    NodeToolbar: NodeToolbarActionTypes
};

//
// Export the actions
//
export const actions = {
    NodeToolbar
};
