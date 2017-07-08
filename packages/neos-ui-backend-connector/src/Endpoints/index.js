import {urlWithParams, searchParams} from './Helpers';

const fetchJson = (endpoint, options) => fetch(endpoint, options).then(res => res.json());

const change = csrfToken => changes => fetchJson('/neos!/service/change', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        changes
    })
});

const publish = csrfToken => (nodeContextPaths, targetWorkspaceName) => fetchJson('/neos!/service/publish', {
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
});

const discard = csrfToken => nodeContextPaths => fetchJson('/neos!/service/discard', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nodeContextPaths
    })
});

const changeBaseWorkspace = csrfToken => targetWorkspaceName => fetchJson('/neos!/service/changeBaseWorkspace', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        targetWorkspaceName
    })
});

const loadImageMetadata = imageVariantUuid => fetchJson(`neos/content/image-with-metadata?image=${imageVariantUuid}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][height]:85
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][position]:10
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][width]:210
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][x]:0
 * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][y]:0
 * asset[originalAsset]:56d183f2-ee66-c845-7e2d-40661fb27571
 * @param asset
 */
const createImageVariant = csrfToken => (originalAssetUuid, adjustments) => fetchJson('neos/content/create-image-variant', {
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
});

const uploadAsset = csrfToken => (file, siteNodeName, metadata = 'Image') => {
    const data = new FormData();
    data.append('__siteNodeName', siteNodeName);
    data.append('asset[resource]', file);
    data.append('metadata', metadata);

    return fetchJson('neos/content/upload-asset', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken
        },
        body: data
    });
};

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
const searchNodes = options => fetch(urlWithParams('/neos/service/nodes', options), {
    method: 'GET',
    credentials: 'include'
})
    .then(result => result.text())
    .then(result => {
        const d = document.createElement('div');
        d.innerHTML = result;
        const nodes = d.querySelector('.nodes');

        return Array.prototype.map.call(nodes.querySelectorAll('.node'), node => ({
            label: node.querySelector('.node-label').innerText,
            identifier: node.querySelector('.node-identifier').innerText
        }));
    });

const parseGetSingleNodeResult = requestPromise => {
    return requestPromise.then(result =>
        result.text().then(bodyAsString => ({bodyAsString, result}))
    ).then(({bodyAsString, result}) => {
        if (result.status === 200) {
            const d = document.createElement('div');
            d.innerHTML = bodyAsString;

            const nodeFrontendUri = d.querySelector('.node-frontend-uri').getAttribute('href');

            return {
                nodeFound: true,
                nodeFrontendUri
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
const getSingleNode = (nodeIdentifier, params = {}) => parseGetSingleNodeResult(fetch(urlWithParams('/neos/service/nodes/' + nodeIdentifier, params), {
    method: 'GET',
    credentials: 'include'
}));

const adoptNodeToOtherDimension = csrfToken => ({identifier, targetDimensions, sourceDimensions, workspaceName, copyContent = false}) => {
    const params = {
        identifier,
        dimensions: targetDimensions,
        sourceDimensions,
        workspaceName,
        mode: (copyContent ? 'adoptFromAnotherDimensionAndCopyContent' : 'adoptFromAnotherDimension'),
        __csrfToken: csrfToken
    };

    return parseGetSingleNodeResult(fetch('/neos/service/nodes', {
        method: 'POST',
        credentials: 'include',
        body: searchParams(params)
    }));
};

const setUserPreferences = csrfToken => (key, value) => {
    const data = new URLSearchParams();
    data.set('__csrfToken', csrfToken);
    data.set('key', key);
    data.set('value', value);

    return fetch('neos/service/user-preferences', {
        method: 'PUT',
        credentials: 'include',
        body: data
    });
};

const dataSource = (dataSourceIdentifier, dataSourceUri, params = {}) => fetchJson(urlWithParams(dataSourceUri || '/neos/service/data-source/' + dataSourceIdentifier, params), {
    method: 'GET',
    credentials: 'include'
});

export default csrfToken => ({
    loadImageMetadata,
    change: change(csrfToken),
    publish: publish(csrfToken),
    discard: discard(csrfToken),
    changeBaseWorkspace: changeBaseWorkspace(csrfToken),
    createImageVariant: createImageVariant(csrfToken),
    uploadAsset: uploadAsset(csrfToken),
    searchNodes,
    getSingleNode,
    adoptNodeToOtherDimension: adoptNodeToOtherDimension(csrfToken),
    setUserPreferences: setUserPreferences(csrfToken),
    dataSource
});
