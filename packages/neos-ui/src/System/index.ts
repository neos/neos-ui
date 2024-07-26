/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {initializeJsAPI} from '@neos-project/neos-ui-backend-connector';
import fetchWithErrorHandling from '@neos-project/neos-ui-backend-connector/src/FetchWithErrorHandling/index';
import {terminateDueToFatalInitializationError} from '@neos-project/neos-ui-error';

let initialData: any = null;
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

function getInlinedData(dataName: string): any {
    const initialData = parseInitialData();

    if (dataName in initialData) {
        return initialData[dataName];
    }

    return terminateDueToFatalInitializationError(`
        <p>Initial data for <code>${dataName}</code> could not
        be read from <code>#initialData</code> container.</p>
    `);
}

const appContainerOrNull = document.getElementById('appContainer');
if (!appContainerOrNull) {
    terminateDueToFatalInitializationError(`
        <p>This page is missing a container with the id <code>#appContainer</code>.</p>
    `);
}
export const appContainer = appContainerOrNull;

const {csrfToken: csrfTokenOrNull} = appContainer.dataset;
if (!csrfTokenOrNull) {
    terminateDueToFatalInitializationError(`
        <p>The container with the id <code>#appContainer</code> is missing an attribute
        <code>data-csrf-token</code>.</p>
    `);
}
export const csrfToken = csrfTokenOrNull;
fetchWithErrorHandling.setCsrfToken(csrfToken);

const {env: systemEnvOrNull} = appContainer.dataset;
if (!systemEnvOrNull) {
    terminateDueToFatalInitializationError(`
        <p>The container with the id <code>#appContainer</code> is missing an attribute
        <code>data-env</code> (eg. Production, Development, etc...).</p>
    `);
}
export const systemEnv = systemEnvOrNull;

export const serverState = getInlinedData('initialState');

export const configuration = getInlinedData('configuration');

export const nodeTypes = getInlinedData('nodeTypes');

export const frontendConfiguration = getInlinedData('frontendConfiguration');

export const routes = getInlinedData('routes');

export const menu: {
    label: string;
    icon: string;
    uri: string;
    target: 'Window';
    children: {
        icon: string;
        label: string;
        uri: string;
        target: 'Window';
        isActive: boolean;
        skipI18n: boolean;
    }[]
}[] = getInlinedData('menu');

export const user: {
    name: {
        title: string;
        firstName: string;
        middleName: string;
        lastName: string;
        otherName: string;
        fullName: string;
    };
    preferences: {
        interfaceLanguage: null | string;
    };
} = getInlinedData('user');

export const neos = initializeJsAPI(window, {
    systemEnv,
    routes
});
