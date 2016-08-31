import {api} from 'Shared/Utilities/';

const fetchJson = (endpoint, options) => fetch(endpoint, options).then(res => res.json());

export const change = changes => fetchJson('/neos!/service/change', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': api.getCsrfToken(),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        changes
    })
});

export const publish = (nodeContextPaths, targetWorkspaceName) => fetchJson('/neos!/service/publish', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': api.getCsrfToken(),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nodeContextPaths,
        targetWorkspaceName
    })
});

export const discard = nodeContextPaths => fetchJson('/neos!/service/discard', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': api.getCsrfToken(),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nodeContextPaths
    })
});

export const loadImageMetadata = imageVariantUuid => fetchJson(`neos/content/image-with-metadata?image=${imageVariantUuid}`, {
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
export const createImageVariant = (originalAssetUuid, adjustments) => fetchJson('neos/content/create-image-variant', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': api.getCsrfToken(),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        asset: {
            originalAsset: originalAssetUuid,
            adjustments
        }
    })
});

export const uploadAsset = (file, siteNodeName, metadata = 'Image') => {
    const data = new FormData();
    data.append('__siteNodeName', siteNodeName);
    data.append('asset[resource]', file);
    data.append('metadata', metadata);

    return fetchJson('neos/content/upload-asset', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': api.getCsrfToken()
        },
        body: data
    });
};
