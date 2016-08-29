import 'core-js/shim';
import 'regenerator-runtime/runtime';
import 'Shared/Styles/style.css';
import registry from 'Host/Extensibility/Registry/index';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Map} from 'immutable';
import backend from 'Host/Service/Backend';
import feedbackManager from 'Host/Service/FeedbackManager';

import {watchPersist} from 'Host/Sagas/Changes/index';
import {watchPublish, watchDiscard} from 'Host/Sagas/Publish/index';
import {reducer, actions} from 'Host/Redux/index';
import {bootSaga} from 'Host/Sagas/System/index';
import {applicationViewSaga} from 'Host/Sagas/View/index';
import {inspectorSaga} from 'Host/Sagas/UI/Inspector/index';
import apiDefinitionFactory from './Extensibility/ApiDefinitionForConsumers/index';
import {watchToggle, watchCommenceUncollapse} from './Sagas/UI/PageTree/index';
import {manifests} from './Extensibility/ApiDefinitionForConsumers/Manifest/index';

apiDefinitionFactory();
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
// Bootstrap the backend services
//
backend.feedbackManager = feedbackManager(store);

//
// Bootstrap the saga middleware with initial sagas
//
sagaMiddleWare.run(bootSaga, store);
sagaMiddleWare.run(applicationViewSaga, store);
sagaMiddleWare.run(inspectorSaga);
sagaMiddleWare.run(watchPersist);
sagaMiddleWare.run(watchPublish);
sagaMiddleWare.run(watchDiscard);
sagaMiddleWare.run(watchToggle);
sagaMiddleWare.run(watchCommenceUncollapse);

document.addEventListener('DOMContentLoaded', () => {
    manifests.forEach((manifest) => manifest(registry));
    store.dispatch(actions.System.boot());
});
