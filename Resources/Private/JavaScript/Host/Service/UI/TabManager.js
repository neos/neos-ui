import uuid from 'uuid';
import {actions} from 'Host/Redux/';
import {immutableOperations} from 'Shared/Util/';
import backend from 'Host/Service/Backend.js';

const {$get} = immutableOperations;

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

    changeActiveTabSrc(src) {
        const state = this.store.getState();
        const tabId = $get(state, 'ui.tabs.active.id');

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
        const {nodeTreeService} = backend;
        this.store.dispatch(actions.Transient.Nodes.addBulk(configuration.nodes));

        this.store.dispatch(actions.UI.Tabs.setMetaData(tabId, assign({
            title: tabId,
            workspace: {
                publishableNodes: []
            }
        }, configuration.metaData || {})));

        nodeTreeService.loadTree(configuration.metaData.contextPath);
    }
}

export default store => new TabManager(store);
