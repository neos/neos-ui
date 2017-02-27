import {urlWithParams} from './Helpers';

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
            value: node.querySelector('.node-identifier').innerText
        }));
    });

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

export default csrfToken => ({
    loadImageMetadata,
    change: change(csrfToken),
    publish: publish(csrfToken),
    discard: discard(csrfToken),
    changeBaseWorkspace: changeBaseWorkspace(csrfToken),
    createImageVariant: createImageVariant(csrfToken),
    uploadAsset: uploadAsset(csrfToken),
    searchNodes,
    setUserPreferences: setUserPreferences(csrfToken)
});
