import actions from '../Actions/';

class ChangeManager {

    constructor(store, csrfToken, endpoint) {
        this.store = store;
        this.csrfToken = csrfToken;
        this.endpoint = '/che!/service/change';

        // Commence flush of changes every second
        setInterval(() => this.flushChanges(), 1000);
    }

    commitChange(change) {
        // dispatch add change action
        this.store.dispatch(actions.Transient.Changes.addChange(change));
    }

    flushChanges() {
        const changes = this.store.getState().get('changes');

        if (!changes.isEmpty()) {
            const feedbackManager = window['@Neos:Backend'].feedbackManager;
            // dispatch clear changes action
            this.store.dispatch(actions.Transient.Changes.clearChanges());

            fetch(this.endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-Flow-Csrftoken': this.csrfToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    changes: changes.toJSON()
                })
            })
            .then(response => response.json())
            .then(feedbackManager.handleFeedback.bind(feedbackManager));
        }
    }
}

export default (store, csrfToken) => new ChangeManager(store, csrfToken);
