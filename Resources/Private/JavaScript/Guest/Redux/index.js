import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import merge from 'lodash.merge';

import {handleActions} from 'Shared/Utilities/index';
import sagas from 'Guest/Sagas/index';

import {
    reducer as NodeToolbarReducer,
    actionTypes as NodeToolbarActionTypes,
    initialState as NodeToolbarInitialState,
    actions as NodeToolbar
} from './NodeToolbar/index';
import {
    reducer as CKEditorToolbarReducer,
    actionTypes as CKEditorToolbarActionTypes,
    initialState as CKEditorToolbarInitialState,
    actions as CKEditorToolbar
} from './CKEditorToolbar/index';
import {
    reducer as EditorToolbarReducer,
    actionTypes as EditorToolbarActionTypes,
    initialState as EditorToolbarInitialState,
    actions as EditorToolbar
} from './EditorToolbar/index';

const reducers = {
    ...NodeToolbarReducer,
    ...CKEditorToolbarReducer,
    ...EditorToolbarReducer
};
const sagaMiddleWare = createSagaMiddleware();
const rootReducer = handleActions(reducers);
const devToolsStoreEnhancer = () => typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f;
const initialState = {
    nodeToolbar: NodeToolbarInitialState,
    ckEditorToolbar: CKEditorToolbarInitialState,
    editorToolbar: EditorToolbarInitialState
};

//
// Export the store factory
//
export function configureStore() {
    const mergedInitialState = merge({}, initialState);
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
    NodeToolbar: NodeToolbarActionTypes,
    CKEditorToolbar: CKEditorToolbarActionTypes,
    EditorToolbar: EditorToolbarActionTypes
};

//
// Export the actions
//
export const actions = {
    NodeToolbar,
    CKEditorToolbar,
    EditorToolbar
};
