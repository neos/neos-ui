import 'core-js/shim';
import 'regenerator-runtime/runtime';
import 'Shared/Styles/style.css';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Map} from 'immutable';

import {reducer, actions} from '@neos-project/neos-ui-redux-store';

import allSagas from 'Host/Sagas/index';
import apiDefinitionFactory from './Extensibility/ApiDefinitionForConsumers/index';
import {manifests} from './Extensibility/ApiDefinitionForConsumers/Manifest/index';

const {globalRegistry} = apiDefinitionFactory();
// Note: OUR manifest must be included *after* the apiDefinitionFactory has been applied.
require('./manifest');

const devToolsArePresent = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined';
const devToolsStoreEnhancer = () => devToolsArePresent ? window.devToolsExtension() : f => f;
const sagaMiddleWare = createSagaMiddleware();
const store = createStore(reducer, new Map(), compose(
    applyMiddleware(sagaMiddleWare),
    devToolsStoreEnhancer()
));

//
// Bootstrap the saga middleware with initial sagas
//
allSagas.forEach(saga => sagaMiddleWare.run(saga, store));

document.addEventListener('DOMContentLoaded', () => {
    manifests.forEach(manifest => manifest(globalRegistry));
    store.dispatch(actions.System.boot());
});
