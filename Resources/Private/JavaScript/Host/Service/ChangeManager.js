import {actions} from 'Host/Ducks/';
import backend from './Backend.js';

class ChangeManager {
    constructor(store, csrfToken) {
        this.store = store;
        this.csrfToken = csrfToken;
        this.endpoint = '/che!/service/change';

        // Commence flush of changes every second
        setInterval(() => this.flushChanges(), 1000);
    }

    commitChange(change) {
        // dispatch add change action
        this.store.dispatch(actions.Transient.Changes.add(change));
    }

    flushChanges() {
        const changes = this.store.getState().get('changes');

        if (!changes.isEmpty()) {
            const {feedbackManager} = backend;

            this.store.dispatch(actions.UI.Remote.startSaving());
            this.store.dispatch(actions.Transient.Changes.clear());

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
            .then(feedbackManager.handleFeedback.bind(feedbackManager))
            .then(() => this.store.dispatch(actions.UI.Remote.finishSaving()));
        }
    }
}

export default (store, csrfToken) => new ChangeManager(store, csrfToken);
