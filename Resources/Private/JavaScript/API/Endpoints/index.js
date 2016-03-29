export const change = changes => fetch('/neos!/service/change', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': window.neos.csrfToken(),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        changes
    })
}).then(response => response.json());

export const publish = (nodeContextPaths, targetWorkspaceName) => fetch('/neos!/service/publish', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': window.neos.csrfToken(),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nodeContextPaths,
        targetWorkspaceName
    })
}).then(response => response.json());

export const discard = nodeContextPaths => fetch('/neos!/service/discard', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': window.neos.csrfToken(),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nodeContextPaths
    })
}).then(response => response.json());

export const loadImageMetadata = imageVariantUuid => fetch('neos/content/image-with-metadata?image=' + imageVariantUuid, {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => response.json());
