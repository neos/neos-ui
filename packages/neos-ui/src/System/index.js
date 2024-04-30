import {initializeJsAPI} from '@neos-project/neos-ui-backend-connector';
import fetchWithErrorHandling from '@neos-project/neos-ui-backend-connector/src/FetchWithErrorHandling/index';
import {terminateDueToFatalInitializationError} from '@neos-project/neos-ui-error';

let initialData = null;
function parseInitialData() {
    if (initialData) {
        return initialData;
    }

    const initialDataContainer = document.getElementById('initialData');
    if (!initialDataContainer) {
        return terminateDueToFatalInitializationError(`
            <p>This page is missing a <code>&lt;script/&gt;</code>-container with the
            id <code>#initialData</code>.</p>
        `);
    }

    try {
        const initialDataAsJson = initialDataContainer.innerText;
        initialData = JSON.parse(initialDataAsJson);

        if (typeof initialData === 'object' && initialData) {
            return initialData;
        }

        return terminateDueToFatalInitializationError(`
            <p>JSON-content of <code>#initialData</code> has an unexpected
            type: <code>${typeof initialData}</code></p>
        `);
    } catch (err) {
        return terminateDueToFatalInitializationError(`
            <p>JSON.parse for content of <code>#initialData</code> failed:
            ${err}</p>
        `);
    }
}

function getInlinedData(dataName) {
    const initialData = parseInitialData();

    if (dataName in initialData) {
        return initialData[dataName];
    }

    return terminateDueToFatalInitializationError(`
        <p>Initial data for <code>${dataName}</code> could not
        be read from <code>#initialData</code> container.</p>
    `);
}

export const appContainer = document.getElementById('appContainer');
if (!appContainer) {
    terminateDueToFatalInitializationError(`
        <p>This page is missing a container with the id <code>#appContainer</code>.</p>
    `);
}

export const {csrfToken} = appContainer.dataset;
if (!csrfToken) {
    terminateDueToFatalInitializationError(`
        <p>The container with the id <code>#appContainer</code> is missing an attribute
        <code>data-csrf-token</code>.</p>
    `);
}

fetchWithErrorHandling.setCsrfToken(csrfToken);

export const {env: systemEnv} = appContainer.dataset;
if (!systemEnv) {
    terminateDueToFatalInitializationError(`
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

export const user = getInlinedData('user');

export const neos = initializeJsAPI(window, {
    systemEnv,
    routes
});
