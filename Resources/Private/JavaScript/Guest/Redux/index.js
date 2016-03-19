import {createStore} from 'redux';
import merge from 'lodash.merge';

import {handleActions} from 'Host/Utilities/index';

import {
    reducer as InlineToolbarReducer,
    actionTypes as InlineToolbarActionTypes,
    initialState as InlineToolbarInitialState,
    actions as InlineToolbar
} from './InlineToolbar/index';

const reducers = {
    ...InlineToolbarReducer
};
const rootReducer = handleActions(reducers);
const devToolsStoreEnhancer = () => typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f;
const initialState = {
    inlineToolbar: InlineToolbarInitialState
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
    InlineToolbar: InlineToolbarActionTypes
};

//
// Export the actions
//
export const actions = {
    InlineToolbar
};
