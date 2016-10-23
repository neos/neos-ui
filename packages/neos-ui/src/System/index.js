import {take, put} from 'redux-saga/effects';

import {delay, discover} from '@neos-project/utils-helpers';
import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';
import {initializeJsAPI} from '@neos-project/neos-ui-backend-connector';

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

export const getMenu = discover(function * () {
    const appContainer = yield getAppContainer;

    return JSON.parse(appContainer.querySelector('[data-json="menu"]').innerHTML);
});

export const getTranslations = discover(function * () {
    const appContainer = yield getAppContainer;

    return JSON.parse(appContainer.querySelector('[data-json="translations"]').innerHTML);
});

export const getNeos = discover(function * () {
    const csrfToken = yield getCsrfToken;
    const systemEnv = yield getSystemEnv;

    const neos = initializeJsAPI(window, {
        csrfToken,
        systemEnv
    });

    return neos;
});
