import {urlWithParams, searchParams} from './Helpers';

import fetchWithErrorHandling from '../FetchWithErrorHandling/index';

const change = changes => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
    url: '/neos!/service/change',

    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        changes
    })
})).then(response => response.json());

const publish = (nodeContextPaths, targetWorkspaceName) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
    url: '/neos!/service/publish',
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nodeContextPaths,
        targetWorkspaceName
    })
})).then(response => response.json());

const discard = nodeContextPaths => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
    url: '/neos!/service/discard',

    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nodeContextPaths
    })
})).then(response => response.json());

const changeBaseWorkspace = targetWorkspaceName => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
    url: '/neos!/service/changeBaseWorkspace',

    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        targetWorkspaceName
    })
})).then(response => response.json());

const loadImageMetadata = imageVariantUuid => fetchWithErrorHandling.withCsrfToken(() => ({
    url: `neos/content/image-with-metadata?image=${imageVariantUuid}`,

    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
})).then(response => response.json());

/**
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][height]:85
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][position]:10
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][width]:210
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][x]:0
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][y]:0
 * asset[originalAsset]:56d183f2-ee66-c845-7e2d-40661fb27571
 * @param asset
 */
const createImageVariant = (originalAssetUuid, adjustments) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
    url: 'neos/content/create-image-variant',

    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        asset: {
            originalAsset: originalAssetUuid,
            adjustments
        }
    })
})).then(response => response.json());

const uploadAsset = (file, siteNodeName, metadata = 'Image') => fetchWithErrorHandling.withCsrfToken(csrfToken => {
    const data = new FormData();
    data.append('__siteNodeName', siteNodeName);
    data.append('asset[resource]', file);
    data.append('metadata', metadata);

    return {
        url: 'neos/content/upload-asset',

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken
        },
        body: data
    };
}).then(response => response.json());

const extractFileEndingFromUri = uri => {
    const parts = uri.split('.');
    return parts.length ? '.' + parts[parts.length - 1] : '';
};

const assetSearch = (searchTerm = '') => fetchWithErrorHandling.withCsrfToken(() => ({
    url: urlWithParams('/neos/service/assets', {searchTerm}),

    method: 'GET',
    credentials: 'include'
}))
    .then(result => result.text())
    .then(result => {
        const d = document.createElement('div');
        d.innerHTML = result;
        const assetRoot = d.querySelector('.assets');

        return Array.prototype.map.call(assetRoot.querySelectorAll('.asset'), asset => ({
            label: asset.querySelector('.asset-label').innerText,
            preview: asset.querySelector('[rel=thumbnail]').getAttribute('href'),
            identifier: asset.querySelector('.asset-identifier').innerText
        }));
    });


const assetDetail = (identifier) => fetchWithErrorHandling.withCsrfToken(() => ({
    url: '/neos/service/assets/' + identifier,

    method: 'GET',
    credentials: 'include'
}))
    .then(result => result.text())
    .then(result => {
        const d = document.createElement('div');
        d.innerHTML = result;
        const asset = d.querySelector('.asset');

        return {
            label: asset.querySelector('.asset-label').innerText,
            preview: asset.querySelector('[rel=preview]').getAttribute('href'),
            identifier: asset.querySelector('.asset-identifier').innerText
        };
    });

/**
 * searchTerm:se
 * nodeTypes[]:TYPO3.Neos.NodeTypes:Page
 * workspaceName:user-admin
 * dimensions[language][]:en_US
 * contextNode:/sites/neosdemo@user-admin;language=en_US
 *
 * !! for options, use selectors.UI.NodeLinking.contextForNodeLinking and start modifying it!
 *
 * returns an array of {label, value} objects
 */
const searchNodes = options => fetchWithErrorHandling.withCsrfToken(() => ({
    url: urlWithParams('/neos/service/nodes', options),

    method: 'GET',
    credentials: 'include'
}))
    .then(result => result.text())
    .then(result => {
        const d = document.createElement('div');
        d.innerHTML = result;
        const nodes = d.querySelector('.nodes');

        return Array.prototype.map.call(nodes.querySelectorAll('.node'), node => {
            const uri = node.querySelector('.node-frontend-uri').innerText;
            return {
            label: node.querySelector('.node-label').innerText,
                identifier: node.querySelector('.node-identifier').innerText,
                nodeType: node.querySelector('.node-type').innerText,
                uri,
                uriInLiveWorkspace: uri.split('@')[0] + extractFileEndingFromUri(uri)
            };
        });
    });

const parseGetSingleNodeResult = requestPromise => {
    return requestPromise.then(result =>
        result.text().then(bodyAsString => ({bodyAsString, result}))
    ).then(({bodyAsString, result}) => {
        if (result.status === 200) {
            const d = document.createElement('div');
            d.innerHTML = bodyAsString;

            const nodeFrontendUri = d.querySelector('.node-frontend-uri').getAttribute('href');

            // Hackish way to get context string from uri
            const contextString = nodeFrontendUri.split('@')[1].split('.')[0];
            // TODO: Temporary hack due to missing contextPath in the API response
            const nodeContextPath = `${d.querySelector('.node-path').innerHTML}@${contextString}`;

            return {
                nodeFound: true,
                nodeFrontendUri,
                nodeContextPath
            };
        } else if (result.status === 404) {
            const nodeExistsInOtherDimensions = Boolean(result.headers.get('X-Neos-Node-Exists-In-Other-Dimensions'));
            const numberOfNodesMissingOnRootline = parseInt(result.headers.get('X-Neos-Nodes-Missing-On-Rootline'), 10) - 1;
            return {
                nodeFound: false,
                nodeExistsInOtherDimensions,
                numberOfNodesMissingOnRootline
            };
        }
    });
};

/**
 * "params" is an object with:
 * - dimensions
 * - workspaceName
 *
 * !! for params, use selectors.UI.NodeLinking.contextForNodeLinking and start modifying it!
 */
const getSingleNode = (nodeIdentifier, params = {}) => parseGetSingleNodeResult(fetchWithErrorHandling.withCsrfToken(() => ({
    url: urlWithParams('/neos/service/nodes/' + nodeIdentifier, params),

    method: 'GET',
    credentials: 'include'
})));

const adoptNodeToOtherDimension = ({identifier, targetDimensions, sourceDimensions, workspaceName, copyContent = false}) => parseGetSingleNodeResult(fetchWithErrorHandling.withCsrfToken(csrfToken => ({
    url: '/neos/service/nodes',

    method: 'POST',
    credentials: 'include',
    body: searchParams({
        identifier,
        dimensions: targetDimensions,
        sourceDimensions,
        workspaceName,
        mode: (copyContent ? 'adoptFromAnotherDimensionAndCopyContent' : 'adoptFromAnotherDimension'),
        __csrfToken: csrfToken
    })
})));

const setUserPreferences = (key, value) => fetchWithErrorHandling.withCsrfToken(csrfToken => {
    const data = new URLSearchParams();
    data.set('__csrfToken', csrfToken);
    data.set('key', key);
    data.set('value', value);

    return {
        url: 'neos/service/user-preferences',

        method: 'PUT',
        credentials: 'include',
        body: data
    };
});

const dataSource = (dataSourceIdentifier, dataSourceUri, params = {}) => fetchWithErrorHandling.withCsrfToken(() => ({
    url: urlWithParams(dataSourceUri || '/neos/service/data-source/' + dataSourceIdentifier, params),

    method: 'GET',
    credentials: 'include'
})).then(response => response.json());

const getJsonResource = resourceUri => fetchWithErrorHandling.withCsrfToken(() => ({
    url: resourceUri,
    method: 'GET',
    credentials: 'include'
})).then(response => response.json());

const tryLogin = (username, password) => {
    const data = new URLSearchParams();
    data.set('__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][username]', username);
    data.set('__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][password]', password);
    // here, we
    return fetch('/neos/login.json', {
        method: 'POST',
        body: data,
        credentials: 'same-origin'
    })
    // parse the JSON if possible ...
    .then(response => response.json())
    // ... and if the JSON cannot be parsed, convert this to "false".
    .then(result => result, () => false)
    // return the new CSRF Protection token
    .then(result => result && result.csrfToken);
};

export default () => ({
    loadImageMetadata,
    change,
    publish,
    discard,
    changeBaseWorkspace,
    createImageVariant,
    uploadAsset,
    assetSearch,
    assetDetail,
    searchNodes,
    getSingleNode,
    adoptNodeToOtherDimension,
    setUserPreferences,
    dataSource,
    getJsonResource,
    tryLogin
});
