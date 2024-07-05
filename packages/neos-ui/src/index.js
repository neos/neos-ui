import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import merge from 'lodash.merge';

import {actions} from '@neos-project/neos-ui-redux-store';
import {createConsumerApi} from '@neos-project/neos-ui-extensibility';
import fetchWithErrorHandling from '@neos-project/neos-ui-backend-connector/src/FetchWithErrorHandling';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import backend from '@neos-project/neos-ui-backend-connector';
import {handleActions} from '@neos-project/utils-redux';
import {showFlashMessage} from '@neos-project/neos-ui-error';

import {
    appContainer,
    frontendConfiguration,
    configuration,
    routes,
    serverState,
    menu,
    nodeTypes
} from './System';
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
require('@neos-project/neos-ui-ckeditor5-bindings');
require('@neos-project/neos-ui-validators/src/manifest');
require('@neos-project/neos-ui-i18n/src/manifest');
require('@neos-project/neos-ui-sagas/src/manifest');

async function main() {
    initializePlugins();
    initializeFrontendConfiguration();
    initializeAdditionalReduxReducers();
    initializeAdditionalReduxSagas();
    initializeReduxState();
    initializeFetchWithErrorHandling();

    await Promise.all([
        loadNodeTypesSchema(),
        loadTranslations(),
        loadImpersonateStatus()
    ]);

    store.dispatch(actions.System.ready());

    renderApplication();
    reloadNodes();
}

function initializeFrontendConfiguration() {
    const frontendConfigurationRegistry = globalRegistry.get('frontendConfiguration');

    Object.keys(frontendConfiguration).forEach(key => {
        frontendConfigurationRegistry.set(key, {
            ...frontendConfiguration[key]
        });
    });
}

function initializePlugins() {
    manifests
        .map(manifest => manifest[Object.keys(manifest)[0]])
        .forEach(({bootstrap}) => bootstrap(globalRegistry, {store, frontendConfiguration, configuration, routes}));
}

function initializeAdditionalReduxReducers() {
    const reducers = globalRegistry.get('reducers').getAllAsList().map(element => element.reducer);
    delegatingReducer.setReducer(handleActions(reducers));
}

function initializeAdditionalReduxSagas() {
    globalRegistry.get('sagas').getAllAsList().forEach(element => sagaMiddleWare.run(element.saga, {store, globalRegistry, configuration, routes}));
}

function initializeReduxState() {
    const persistedState = localStorage.getItem('persistedState')
        ? JSON.parse(localStorage.getItem('persistedState'))
        : {};
    const mergedState = merge({}, serverState, persistedState);

    store.dispatch(actions.System.init(mergedState));
}

function initializeFetchWithErrorHandling() {
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

        showFlashMessage({
            id: 'fetch error',
            severity: 'error',
            message
        });
    });
}

async function loadNodeTypesSchema() {
    const {getJsonResource} = backend.get().endpoints;
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');

    const nodeTypesSchema = await getJsonResource(configuration.endpoints.nodeTypeSchema);
    Object.keys(nodeTypesSchema.nodeTypes).forEach(nodeTypeName => {
        nodeTypesRegistry.set(nodeTypeName, {
            ...nodeTypesSchema.nodeTypes[nodeTypeName],
            name: nodeTypeName
        });
    });

    nodeTypesRegistry.setConstraints(nodeTypesSchema.constraints);
    nodeTypesRegistry.setInheritanceMap(nodeTypesSchema.inheritanceMap);

    const {groups, roles} = nodeTypes;
    nodeTypesRegistry.setGroups(groups);
    nodeTypesRegistry.setRoles(roles);
}

async function loadTranslations() {
    const {getJsonResource} = backend.get().endpoints;
    const i18nRegistry = globalRegistry.get('i18n');
    const translations = await getJsonResource(configuration.endpoints.translations);

    i18nRegistry.setTranslations(translations);
}

async function loadImpersonateStatus() {
    try {
        const {impersonateStatus} = backend.get().endpoints;
        const impersonateState = await impersonateStatus();
        if (impersonateState) {
            store.dispatch(actions.User.Impersonate.fetchStatus(impersonateState));
        }
    } catch (error) {
        showFlashMessage({
            id: 'impersonateStatusError',
            severity: 'error',
            message: error.message
        });
    }
}

function renderApplication() {
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
}

function reloadNodes() {
    const state = store.getState();
    const siteNodeContextPath = state?.cr?.nodes?.siteNode;
    const documentNodeContextPath = state?.cr?.nodes?.documentNode;

    store.dispatch(actions.CR.Nodes.reloadState({
        siteNodeContextPath,
        documentNodeContextPath,
        merge: true
    }));
}

document.addEventListener('DOMContentLoaded', main);
