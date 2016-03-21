export const change = changes => fetch('/che!/service/change', {
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

export const publish = (nodeContextPaths, targetWorkspaceName) => fetch('/che!/service/publish', {
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

export const discard = nodeContextPaths => fetch('/che!/service/discard', {
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
