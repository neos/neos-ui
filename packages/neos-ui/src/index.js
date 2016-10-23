import 'core-js/shim';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {take, put} from 'redux-saga/effects';
import {Map} from 'immutable';

import {reducer, actions} from '@neos-project/neos-ui-redux-store';
import {createConsumerApi} from '@neos-project/neos-ui-extensibility';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {delay, discover} from '@neos-project/utils-helpers';

import allSagas from './Sagas/index';
import * as system from './System';
import Root from './Containers/Root';

const devToolsArePresent = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined';
const devToolsStoreEnhancer = () => devToolsArePresent ? window.devToolsExtension() : f => f;
const sagaMiddleWare = createSagaMiddleware();
const store = createStore(reducer, new Map(), compose(
    applyMiddleware(sagaMiddleWare),
    devToolsStoreEnhancer()
));

const manifests = [];
const globalRegistry = new SynchronousMetaRegistry(`The global registry`);

//
// Create the host plugin api and load local manifests
//
createConsumerApi(manifests, {});
require('./manifest');
require('@neos-project/neos-ui-contentrepository');
require('@neos-project/neos-ui-editors');
require('@neos-project/neos-ui-ckeditor-bindings');

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

    //
    // Hydrate server state
    //
    const serverState = yield system.getServerState;
    yield put(actions.System.init(serverState));

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
    const translations = yield system.getTranslations;

    //
    // After everything was initilalized correctly, render the application itself.
    //
    ReactDOM.render(
        <Root
            globalRegistry={globalRegistry}
            menu={menu}
            configuration={configuration}
            translations={translations}
            store={store}
            />,
        appContainer
    );
}

sagaMiddleWare.run(application);
