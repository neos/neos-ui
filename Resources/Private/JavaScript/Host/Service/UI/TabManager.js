import uuid from 'uuid';
import {actions} from '../../Redux/';

import assign from 'lodash.assign';

class TabManager {
    constructor(store) {
        this.store = store;
    }

    createTab(src) {
        const tabId = uuid.v4();

        this.store.dispatch(actions.UI.Tabs.add(tabId, src));
        this.store.dispatch(actions.UI.Tabs.switchTo(tabId));
    }

    closeTab(tabId) {
        if (!this.store.getState().get('ui').get('tabs').get('byId').get(tabId)) {
            throw new Error(`Cannot close tab with id ${tabId}, because it does not exist!`);
        }

        const tabConfiguration = this.store.getState().get('ui').get('tabs').get('byId').get(tabId);

        // remove nodes that are not needed any longer
        this.store.dispatch(actions.UI.Tabs.remove(tabId));
    }

    commitDocumentLoad(tabId, configuration) {
        this.store.dispatch(actions.Transient.Nodes.addBulk(configuration.nodes));

        this.store.dispatch(actions.UI.Tabs.setMetaData(tabId, assign({
            title: tabId,
            workspace: {
                publishableNodes: []
            }
        }, configuration.metaData || {})));
    }
}

export default store => new TabManager(store);
