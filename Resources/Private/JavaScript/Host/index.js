import 'babel-polyfill';
import 'Shared/Styles/style.css';

import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Map} from 'immutable';

import {reducer, actions} from 'Host/Redux/index';
import {bootSaga} from 'Host/Sagas/System/index';
import {applicationViewSaga} from 'Host/Sagas/View/index';
import {inspectorSaga} from 'Host/Sagas/UI/Inspector/index';

const devToolsArePresent = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined';
const devToolsStoreEnhancer = () =>  devToolsArePresent ? window.devToolsExtension() : f => f;
const sagaMiddleWare = createSagaMiddleware();
const store = createStore(reducer, new Map(), compose(
    applyMiddleware(sagaMiddleWare),
    devToolsStoreEnhancer()
));

sagaMiddleWare.run(bootSaga, store);
sagaMiddleWare.run(applicationViewSaga, store);
sagaMiddleWare.run(inspectorSaga);

document.addEventListener('DOMContentLoaded', () => store.dispatch(actions.System.boot()));
>>>>>>> WIP: Make inspector editors redux-unaware & extensible
