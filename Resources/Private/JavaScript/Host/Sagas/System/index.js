import {take, put} from 'redux-saga/effects';
import {delay, discover} from 'Shared/Utilities/Promises';
import {actionTypes, actions} from 'Host/Redux/index';
import initializeJSAPI from 'API/index';

let injectStore = null;
export const getStore = discover(function * () {
    const store = yield new Promise(resolve => {
        injectStore = resolve;
    });
    return store;
});

export const getAppContainer = discover(function * () {
    const appContainer = yield new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', () => {
            resolve(document.getElementById('appContainer'));
        });
    });

    return appContainer;
});

export const getCsrfToken = discover(function * () {
    const appContainer = yield getAppContainer;
    return appContainer.dataset.csrfToken;
});

export const getSystemEnv = discover(function * () {
    const appContainer = yield getAppContainer;
    return appContainer.dataset.env;
});

export const getServerState = discover(function * () {
    const appContainer = yield getAppContainer;
    return JSON.parse(appContainer.querySelector('[data-json="initialState"]').innerHTML);
});

export const getConfiguration = discover(function * () {
    const appContainer = yield getAppContainer;
    return JSON.parse(appContainer.querySelector('[data-json="configuration"]').innerHTML);
});

export const getTranslations = discover(function * () {
    const appContainer = yield getAppContainer;
    return JSON.parse(appContainer.querySelector('[data-json="translations"]').innerHTML);
});

export const getNeos = discover(function* () {
    const csrfToken = yield getCsrfToken;
    const systemEnv = yield getSystemEnv;

    const neos = initializeJSAPI(window, {
        csrfToken,
        systemEnv
    });

    return neos;
});

export function * bootSaga(store) {
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
