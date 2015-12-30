import actions from '../../Actions/';
import backend from '../Backend.js';

/**
 * The publishing service
 */
class PublishingService {
    constructor(store, csrfToken, endpoints) {
        this.store = store;
        this.csrfToken = csrfToken;
        this.endpoints = {
            publish: '/che!/service/publish',
            discard: '/che!/service/discard'
        };
    }

    publishNodes(nodeContextPaths, targetWorkspaceName) {
        const {feedbackManager} = backend;

        this.store.dispatch(actions.UI.Remote.startPublishing());

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
        .then(feedbackManager.handleFeedback.bind(feedbackManager))
        .then(() => this.store.dispatch(actions.UI.Remote.finishPublishing()));
    }

    discardNodes(nodeContextPaths) {
        const {feedbackManager} = backend;

        this.store.dispatch(actions.UI.Remote.startDiscarding());

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
        .then(feedbackManager.handleFeedback.bind(feedbackManager))
        .then(() => this.store.dispatch(actions.UI.Remote.finishDiscarding()));
    }

}

export default (store, csrfToken, endpoint) => new PublishingService(store, csrfToken, endpoint);
