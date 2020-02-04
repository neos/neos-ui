import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {put, select} from 'redux-saga/effects';
import merge from 'lodash.merge';
import {$get} from 'plow-js';

import {actions} from '@neos-project/neos-ui-redux-store';
import {createConsumerApi} from '@neos-project/neos-ui-extensibility';
import fetchWithErrorHandling from '@neos-project/neos-ui-backend-connector/src/FetchWithErrorHandling';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {delay} from '@neos-project/utils-helpers';
import backend from '@neos-project/neos-ui-backend-connector';
import {handleActions} from '@neos-project/utils-redux';

import * as system from './System';
import localStorageMiddleware from './localStorageMiddleware';
import clipboardMiddleware from './clipboardMiddleware';
import Root from './Containers/Root';
import apiExposureMap from './apiExposureMap';
import DelegatingReducer from './DelegatingReducer';

const devToolsArePresent = typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined';
const devToolsStoreEnhancer = () => devToolsArePresent ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
const sagaMiddleWare = createSagaMiddleware();

const delegatingReducer = new DelegatingReducer();
const store = createStore(delegatingReducer.reducer(), {}, compose(
    applyMiddleware(sagaMiddleWare, localStorageMiddleware, clipboardMiddleware),
    devToolsStoreEnhancer()
));

const manifests = [];
const globalRegistry = new SynchronousMetaRegistry(`The global registry`);

//
// Create the host plugin api and load local manifests
//
createConsumerApi(manifests, apiExposureMap);
require('./manifest');
require('@neos-project/neos-ui-contentrepository');
require('@neos-project/neos-ui-editors');
require('@neos-project/neos-ui-views/src/manifest');
require('@neos-project/neos-ui-guest-frame');
require('@neos-project/neos-ui-ckeditor-bindings');
require('@neos-project/neos-ui-ckeditor5-bindings');
require('@neos-project/neos-ui-validators/src/manifest');
require('@neos-project/neos-ui-i18n/src/manifest');
require('@neos-project/neos-ui-sagas/src/manifest');

//
// The main application
//
function * application() {
    const appContainer = yield system.getAppContainer;

    //
    // Initialize Neos JS API
    //
    yield system.getNeos;

    //
    // Load frontend configuration very early, as we want to make it available in manifests
    //
    const frontendConfiguration = yield system.getFrontendConfiguration;

    const configuration = yield system.getConfiguration;

    const routes = yield system.getRoutes;

    //
    // Initialize extensions
    //
    manifests
        .map(manifest => manifest[Object.keys(manifest)[0]])
        .forEach(({bootstrap}) => bootstrap(globalRegistry, {store, frontendConfiguration, configuration, routes}));

    const reducers = globalRegistry.get('reducers').getAllAsList().map(element => element.reducer);
    delegatingReducer.setReducer(handleActions(reducers));

    //
    // Bootstrap the saga middleware with initial sagas
    //
    globalRegistry.get('sagas').getAllAsList().forEach(element => sagaMiddleWare.run(element.saga, {store, globalRegistry, configuration}));

    //
    // Tell everybody, that we're booting now
    //
    store.dispatch(actions.System.boot());

    const {getJsonResource} = backend.get().endpoints;

    const groupsAndRoles = yield system.getNodeTypes;

    //
    // Load json resources
    //
    const nodeTypesSchemaPromise = getJsonResource(configuration.endpoints.nodeTypeSchema);
    const translationsPromise = getJsonResource(configuration.endpoints.translations);

    // Fire multiple async requests in parallel
    const [nodeTypesSchema, translations] = yield [nodeTypesSchemaPromise, translationsPromise];
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    Object.keys(nodeTypesSchema.nodeTypes).forEach(nodeTypeName => {
        nodeTypesRegistry.set(nodeTypeName, {
            ...nodeTypesSchema.nodeTypes[nodeTypeName],
            name: nodeTypeName
        });
    });
    nodeTypesRegistry.setConstraints(nodeTypesSchema.constraints);
    nodeTypesRegistry.setInheritanceMap(nodeTypesSchema.inheritanceMap);
    nodeTypesRegistry.setGroups(groupsAndRoles.groups);
    nodeTypesRegistry.setRoles(groupsAndRoles.roles);
    nodeTypesRegistry.setDefaultInlineEditor($get('defaultInlineEditor', frontendConfiguration));

    //
    // Load translations
    //
    const i18nRegistry = globalRegistry.get('i18n');
    i18nRegistry.setTranslations(translations);

    const frontendConfigurationRegistry = globalRegistry.get('frontendConfiguration');

    Object.keys(frontendConfiguration).forEach(key => {
        frontendConfigurationRegistry.set(key, {
            ...frontendConfiguration[key]
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

    fetchWithErrorHandling.registerAuthenticationErrorHandler(() => {
        store.dispatch(actions.System.authenticationTimeout());
    });

    fetchWithErrorHandling.registerGeneralErrorHandler((message = 'unknown error') => {
        // Check if the message is a Flow exception response
        if (message.indexOf('Flow-Debug-Exception-Header') >= 0) {
            const htmlContainer = document.createElement('div');
            htmlContainer.innerHTML = message;
            const exceptionHeader = htmlContainer.querySelector('.Flow-Debug-Exception-Header');
            if (exceptionHeader && exceptionHeader.textContent) {
                const exceptionSubject = exceptionHeader.querySelector('.ExceptionSubject');
                message = exceptionSubject.textContent + ' - Check the logs for details';
            } else {
                message = 'Unknown error from unexpected HTML response. Check the logs for details.';
            }
        } else if (message.trim()[0] === '{') {
            // Check if the message is a JSON string
            try {
                const jsonMessage = JSON.parse(message);
                if (jsonMessage.error && jsonMessage.error.message) {
                    message = jsonMessage.error.message + ' - Reference code "' + jsonMessage.error.referenceCode + '"';
                } else {
                    message = 'Unknown error from unexpected JSON response. Check the logs for details.';
                }
            } catch (e) {}
        } else if (message.indexOf('Internal Server Error') >= 0) {
            const htmlContainer = document.createElement('div');
            htmlContainer.innerHTML = message;
            const exception = htmlContainer.querySelector('body');
            message = exception.textContent;
        }

        store.dispatch(actions.UI.FlashMessages.add('fetch error', message, 'error'));
    });

    const menu = yield system.getMenu;

    //
    // After everything was initilalized correctly, render the application itself.
    //
    ReactDOM.render(
        <Root
            globalRegistry={globalRegistry}
            menu={menu}
            configuration={configuration}
            routes={routes}
            store={store}
            />,
        appContainer
    );

    const siteNodeContextPath = yield select($get('cr.nodes.siteNode'));
    const documentNodeContextPath = yield select($get('cr.nodes.documentNode'));
    yield put(actions.CR.Nodes.reloadState({
        siteNodeContextPath,
        documentNodeContextPath,
        merge: true
    }));
}

sagaMiddleWare.run(application);
