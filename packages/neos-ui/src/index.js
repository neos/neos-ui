import 'core-js/shim';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {put} from 'redux-saga/effects';
import {Map} from 'immutable';
import merge from 'lodash.merge';

import {reducer, actions} from '@neos-project/neos-ui-redux-store';
import {createConsumerApi} from '@neos-project/neos-ui-extensibility';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {delay} from '@neos-project/utils-helpers';

import allSagas from './Sagas/index';
import * as system from './System';
import localStorageMiddleware from './localStorageMiddleware';
import Root from './Containers/Root';

const devToolsArePresent = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined';
const devToolsStoreEnhancer = () => devToolsArePresent ? window.devToolsExtension() : f => f;
const sagaMiddleWare = createSagaMiddleware();
const store = createStore(reducer, new Map(), compose(
    applyMiddleware(sagaMiddleWare, localStorageMiddleware),
    devToolsStoreEnhancer()
));

const manifests = [];
const globalRegistry = new SynchronousMetaRegistry(`The global registry`);

//
// Create the host plugin api and load local manifests
//
createConsumerApi(manifests, {
    '@ReactComponents': () => ({
        React
    }),

    // TODO: immutable, plow-js, classnames, react-immutable-proptypes, react-redux, redux-actions, redux-saga, reselect

    // TODO: make SemVer check at runtime for compatibility of API...

    '@NeosProjectStuff': () => ({
        // neos-ui-backend-connector
        // neos-ui-decorators
        // neos-ui-i18n
        // neos-ui-redux-store
        // react-proptypes (optional)
        // react-ui-components

        // TODO: how to write new reducers?
        // TODO: how to write new sagas? -> Registry --> CUSTOM PACKAGE
        // TODO: How to replace containers -> Registry --> CUSTOM PACKAGE
    })
});
console.log("CREATE CONSUMER API");
require('./manifest');
require('@neos-project/neos-ui-contentrepository');
require('@neos-project/neos-ui-editors');
require('@neos-project/neos-ui-ckeditor-bindings');
require('@neos-project/neos-ui-validators');
require('@neos-project/neos-ui-i18n/src/manifest');

//
// The main application
//
function * application() {
    const appContainer = yield system.getAppContainer;

    //
    // We'll show just some loading screen,
    // until we're good to go
    //
    ReactDOM.render(
        <div style={{width: '100vw', height: '100vh', backgroundColor: 'black'}}>
            <h1>Loading...</h1>
        </div>,
        appContainer
    );

    //
    // Initialize Neos JS API
    //
    yield system.getNeos;

    //
    // Initialize extensions
    //
    manifests
        .map(manifest => manifest[Object.keys(manifest)[0]])
        .forEach(({bootstrap}) => bootstrap(globalRegistry));

    //
    // Bootstrap the saga middleware with initial sagas
    //
    allSagas.forEach(saga => sagaMiddleWare.run(saga, {store, globalRegistry}));

    //
    // Tell everybody, that we're booting now
    //
    store.dispatch(actions.System.boot());

    //
    // Load node types
    //
    const nodeTypes = yield system.getNodeTypes;
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');

    Object.keys(nodeTypes.byName).forEach(nodeTypeName => {
        nodeTypesRegistry.add(nodeTypeName, {
            ...nodeTypes.byName[nodeTypeName],
            name: nodeTypeName
        });
    });
    nodeTypesRegistry.setConstraints(nodeTypes.constraints);
    nodeTypesRegistry.setInheritanceMap(nodeTypes.inheritanceMap);
    nodeTypesRegistry.setGroups(nodeTypes.groups);
    nodeTypesRegistry.setRoles(nodeTypes.roles);

    //
    // Load translations
    //
    const translations = yield system.getTranslations;
    const i18nRegistry = globalRegistry.get('@neos-project/neos-ui-i18n');
    i18nRegistry.setTranslations(translations);

    //
    // Load frontend configuration (edit/preview modes)
    //
    const frontendConfiguration = yield system.getFrontendConfiguration;
    const editPreviewModesRegistry = globalRegistry.get('editPreviewModes');

    Object.keys(frontendConfiguration.editPreviewModes).forEach(editPreviewModeName => {
        editPreviewModesRegistry.add(editPreviewModeName, {
            ...frontendConfiguration.editPreviewModes[editPreviewModeName]
        });
    });

    //
    // Hydrate server state
    // Deep merges state fetched from server with the state saved in the local storage
    //
    const serverState = yield system.getServerState;
    const persistedState = localStorage.getItem('persistedState') ? JSON.parse(localStorage.getItem('persistedState')) : {};
    const mergedState = merge({}, serverState, persistedState);
    yield put(actions.System.init(mergedState));

    //
    // Just make sure that everybody does their initialization homework
    //
    yield delay(0);

    //
    // Inform everybody, that we're ready now
    //
    yield put(actions.System.ready());

    const menu = yield system.getMenu;
    const configuration = yield system.getConfiguration;

    //
    // After everything was initilalized correctly, render the application itself.
    //
    ReactDOM.render(
        <Root
            globalRegistry={globalRegistry}
            menu={menu}
            configuration={configuration}
            store={store}
            />,
        appContainer
    );
}

sagaMiddleWare.run(application);
