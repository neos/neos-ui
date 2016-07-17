import {take, put, call} from 'redux-saga/effects';

import {delay, discover} from 'Shared/Utilities/Promises';
import {actionTypes, actions} from 'Host/Redux/index';
import createInspectorEditorRegistry from 'Host/Process/InspectorEditorRegistry/index';
import createHookRegistry from 'Host/Process/HookRegistry/index';
import initializeJSAPI from 'API/index';
import {ui} from 'Host/Plugins/index';
import createApi from 'Host/Extensibility/ApiDefinitionForConsumers/API/index';
import createHostApi from 'Host/Extensibility/ApiDefinitionForConsumers/index';

let injectStore = null;
export const getStore = discover(function* () {
    const store = yield new Promise(resolve => {
        console.log('say what?');
        injectStore = resolve;
    });
    return store;
});

export const getAppContainer = discover(function* () {
    const appContainer = yield new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', () => {
            resolve(document.getElementById('appContainer'));
        });
    });

    return appContainer;
});

export const getCsrfToken = discover(function* () {
    const appContainer = yield getAppContainer;
    return appContainer.dataset.csrfToken;
});

export const getServerState = discover(function* () {
    const appContainer = yield getAppContainer;
    return JSON.parse(appContainer.querySelector('[data-json="initialState"]').innerHTML);
});

export const getConfiguration = discover(function* () {
    const appContainer = yield getAppContainer;
    return JSON.parse(appContainer.querySelector('[data-json="configuration"]').innerHTML);
});

export const getTranslations = discover(function* () {
    const appContainer = yield getAppContainer;
    return JSON.parse(appContainer.querySelector('[data-json="translations"]').innerHTML);
});

export const getInspectorEditorRegistry =  discover(function* () {
    const {asyncModuleMapping, legacyModuleMapping} = yield getConfiguration;
    return createInspectorEditorRegistry(asyncModuleMapping, legacyModuleMapping);
});

export const getHookRegistry =  discover(function* () {
    const {asyncModuleMapping} = yield getConfiguration;
    return createHookRegistry(asyncModuleMapping);
});

export const getApi = discover(function* () {
    const store = yield getStore;
    return createApi(store);
});

export const getHostApi = discover(function* () {
    const api = yield getApi;
    const inspectorEditorRegistry = yield getInspectorEditorRegistry;
    const hookRegistry = yield getHookRegistry;

    return createHostApi(api, inspectorEditorRegistry, hookRegistry);
});

export const getNeos = discover(function* () {
    const csrfToken = yield getCsrfToken;
    const store = yield getStore;
    const neos = initializeJSAPI(window, csrfToken);

    neos.use(ui(store));

    return neos;
});

export function* bootSaga(store) {
    injectStore(store);

    yield take(actionTypes.System.BOOT);

    const serverState = yield getServerState;

    //
    // Kick off initialization for redux, other sagas can
    // listen to this action and start their initialization tasks
    //
    yield put(actions.System.init(serverState));

    //
    // Just make sure that everybody does their initialization
    // homework
    //
    yield delay(0);

    //
    // Inform everybody, that we're ready to rock
    //
    yield put(actions.System.ready());
}
