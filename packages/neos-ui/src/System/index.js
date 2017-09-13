import {discover} from '@neos-project/utils-helpers';
import {initializeJsAPI} from '@neos-project/neos-ui-backend-connector';
import fetchWithErrorHandling from '@neos-project/neos-ui-backend-connector/src/FetchWithErrorHandling/index';

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

    return JSON.parse(appContainer.querySelector('[data-json="initialState"]').textContent);
});

export const getConfiguration = discover(function * () {
    const appContainer = yield getAppContainer;

    return JSON.parse(appContainer.querySelector('[data-json="configuration"]').textContent);
});

export const getNodeTypes = discover(function * () {
    const appContainer = yield getAppContainer;

    return JSON.parse(appContainer.querySelector('[data-json="nodeTypes"]').textContent);
});

export const getFrontendConfiguration = discover(function * () {
    const appContainer = yield getAppContainer;

    return JSON.parse(appContainer.querySelector('[data-json="frontendConfiguration"]').textContent);
});

export const getMenu = discover(function * () {
    const appContainer = yield getAppContainer;

    return JSON.parse(appContainer.querySelector('[data-json="menu"]').textContent);
});

export const getNeos = discover(function * () {
    const csrfToken = yield getCsrfToken;

    fetchWithErrorHandling.setCsrfToken(csrfToken);

    const systemEnv = yield getSystemEnv;

    const neos = initializeJsAPI(window, {
        systemEnv
    });

    return neos;
});
