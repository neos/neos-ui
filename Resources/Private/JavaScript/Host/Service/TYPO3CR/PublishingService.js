import backend from '../Backend.js';

/**
 * The publishing service
 */
class PublishingService {

    constructor(csrfToken, endpoints) {
        this.csrfToken = csrfToken;
        this.endpoints = {
            publish: '/che!/service/publish',
            discard: '/che!/service/discard'
        };
    }

    publishNodes(nodeContextPaths, targetWorkspaceName) {
        const {feedbackManager} = backend;

        fetch(this.endpoints.publish, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Flow-Csrftoken': this.csrfToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nodeContextPaths,
                targetWorkspaceName
            })
        })
        .then(response => response.json())
        .then(feedbackManager.handleFeedback.bind(feedbackManager));
    }

    discardNodes(nodeContextPaths) {
        const {feedbackManager} = backend;

        console.log('discardNodes', nodeContextPaths.toJS());
        console.log('discardNodes', JSON.stringify({
            nodeContextPaths
        }));

        fetch(this.endpoints.discard, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Flow-Csrftoken': this.csrfToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nodeContextPaths
            })
        })
        .then(response => response.json())
        .then(feedbackManager.handleFeedback.bind(feedbackManager));
    }

}

export default (csrfToken, endpoint) => new PublishingService(csrfToken, endpoint);
