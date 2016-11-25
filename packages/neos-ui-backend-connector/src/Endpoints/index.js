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

const urlWithParams = (urlString, params = {}) => {
    const url = new URL(window.location.origin + urlString);
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (Array.isArray(value)) {
            value.forEach(v =>
                searchParams.append(`${key}[]`, v)
            );
        } else {
            searchParams.append(key, value);
        }
    });
    url.search = searchParams.toString();

    return url.toString();
};

/**
 * searchTerm:se
 * workspaceName:user-admin
 * dimensions[language][]:en_US
 * contextNode:/sites/neosdemo@user-admin;language=en_US
 * nodeTypes[]:TYPO3.Neos.NodeTypes:Page
 */
const searchNodes = options => fetch(urlWithParams('/neos/service/nodes', options), {
    method: 'GET',
    credentials: 'include'
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

const loadImageMetadata = imageVariantUuid => fetchJson(`neos/content/image-with-metadata?image=${imageVariantUuid}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * asset[adjustments][TYPO3\Media\Domain\Model\Adjustment\CropImageAdjustment][height]:85
 * asset[adjustments][TYPO3\Media\Domain\Model\Adjustment\CropImageAdjustment][position]:10
 * asset[adjustments][TYPO3\Media\Domain\Model\Adjustment\CropImageAdjustment][width]:210
 * asset[adjustments][TYPO3\Media\Domain\Model\Adjustment\CropImageAdjustment][x]:0
 * asset[adjustments][TYPO3\Media\Domain\Model\Adjustment\CropImageAdjustment][y]:0
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

export default csrfToken => ({
    loadImageMetadata,
    change: change(csrfToken),
    publish: publish(csrfToken),
    discard: discard(csrfToken),
    createImageVariant: createImageVariant(csrfToken),
    uploadAsset: uploadAsset(csrfToken),
    searchNodes
});
