import {discover} from '@neos-project/utils-helpers';
import {initializeJsAPI} from '@neos-project/neos-ui-backend-connector';
import fetchWithErrorHandling from '@neos-project/neos-ui-backend-connector/src/FetchWithErrorHandling/index';

const getInlinedData = dataName => {
    return new Promise((resolve, reject) => {
        const result = window['_NEOS_UI_' + dataName];
        delete window['_NEOS_UI_' + dataName];
        try {
            resolve(result);
        } catch (ex) {
            reject(ex);
        }
    });
};

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

export const getServerState = getInlinedData('initialState');

export const getConfiguration = getInlinedData('configuration');

export const getNodeTypes = getInlinedData('nodeTypes');

export const getFrontendConfiguration = getInlinedData('frontendConfiguration');

export const getRoutes = getInlinedData('routes');

export const getMenu = getInlinedData('menu');

export const getNeos = discover(function * () {
    const csrfToken = yield getCsrfToken;

    fetchWithErrorHandling.setCsrfToken(csrfToken);

    const systemEnv = yield getSystemEnv;
    const routes = yield getRoutes;

    const neos = initializeJsAPI(window, {
        systemEnv,
        routes
    });

    return neos;
});
