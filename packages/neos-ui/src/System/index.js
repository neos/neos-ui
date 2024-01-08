import {initializeJsAPI} from '@neos-project/neos-ui-backend-connector';
import fetchWithErrorHandling from '@neos-project/neos-ui-backend-connector/src/FetchWithErrorHandling/index';

function fatalInitializationError(reason) {
    document.title = 'Neos UI could not be initialized.';
    document.body.style.backgroundColor = 'var(--colors-Error)';
    document.body.innerHTML = `
        <h1>Neos UI could not be initialized.</h1>
        ${reason}
    `;

    throw new Error(document.body.innerText);
}

function getInlinedData(dataName) {
    const result = window['_NEOS_UI_' + dataName];
    delete window['_NEOS_UI_' + dataName];

    if (!result) {
        fatalInitializationError(`
            <p>No value was found under the variable <code>window._NEOS_UI_${dataName}</code>.</p>
        `);
    }

    return result;
}

export const appContainer = document.getElementById('appContainer');
if (!appContainer) {
    fatalInitializationError(`
        <p>This page is missing a container with the id <code>#appContainer</code>.</p>
    `);
}

export const {csrfToken} = appContainer.dataset;
if (!csrfToken) {
    fatalInitializationError(`
        <p>The container with the id <code>#appContainer</code> is missing an attribute
        <code>data-csrf-token</code>.</p>
    `);
}

fetchWithErrorHandling.setCsrfToken(csrfToken);

export const {env: systemEnv} = appContainer.dataset;
if (!systemEnv) {
    fatalInitializationError(`
        <p>The container with the id <code>#appContainer</code> is missing an attribute
        <code>data-env</code> (eg. Production, Development, etc...).</p>
    `);
}

export const serverState = getInlinedData('initialState');

export const configuration = getInlinedData('configuration');

export const nodeTypes = getInlinedData('nodeTypes');

export const frontendConfiguration = getInlinedData('frontendConfiguration');

export const routes = getInlinedData('routes');

export const menu = getInlinedData('menu');

export const neos = initializeJsAPI(window, {
    systemEnv,
    routes
});
