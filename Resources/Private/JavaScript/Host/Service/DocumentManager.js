import actions from '../Actions/';

class DocumentManager {
    constructor(store) {
        this.store = store;
    }

    addConfiguration(documentId, configuration) {
        this.store.dispatch(actions.Transient.Documents.addConfiguration(documentId, configuration));

        if (configuration.title) {
            this.store.dispatch(actions.UI.Tabs.setTabTitle(documentId, configuration.title));
        }
    }

    getConfiguration(documentId) {
        return this.store.getState().get('documents').get('byId').get(documentId);
    }

    commitChange(documentId, change) {
        this.store.dispatch(actions.Transient.Documents.applyChange(documentId, change));
    }

}

export default store => new DocumentManager(store);
