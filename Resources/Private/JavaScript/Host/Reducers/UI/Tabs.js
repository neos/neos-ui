import {ActionTypes} from '../../Constants/';
import Immutable from 'immutable';

function updateActiveTabIfChanged(tabId, state) {
    if (state.get('tabs').get('active').get('id') === tabId ||
        (tabId.contains && tabId.contains(state.get('tabs').get('active').get('id')))) {

        return state.setIn(['tabs', 'active'], state.get('tabs').get('byId').get(
            state.get('tabs').get('active').get('id')
        ));
    }

    return state;
}

export default {
    [ActionTypes.UI.SET_ACTIVE_TAB](state, action) {
        return state.setIn(['ui', 'tabs', 'active'], state.get('tabs').get('byId').get(action.tabId));
    },

    [ActionTypes.UI.SET_TAB_METADATA](state, action) {
        const {title, workspace, contextPath} = action.metaData;
        const {publishableNodes} = workspace;
        const [nodePath] = contextPath.split('@');
        const publishableNodesInDocument = publishableNodes.filter(nodeEnvelope => {
            return nodeEnvelope.contextPath.startsWith(nodePath) &&
                nodeEnvelope.documentContextPath === contextPath;
        });

        return updateActiveTabIfChanged(action.tabId,
            state.mergeIn(['tabs', 'byId', action.tabId], {
                title,
                contextPath
            }).setIn(['tabs', 'byId', action.tabId, 'workspace'], Immutable.fromJS({
                publishableNodes,
                publishableNodesInDocument
            }))
        );
    },

    [ActionTypes.UI.UPDATE_TAB_WORKSPACE_INFO](state, action) {
        const {documentContextPath, workspaceInfo} = action;
        const publishableNodes = workspaceInfo;
        const [nodePath] = documentContextPath.split('@');
        const publishableNodesInDocument = publishableNodes.filter(nodeEnvelope => {
            return nodeEnvelope.contextPath.startsWith(nodePath) &&
                nodeEnvelope.documentContextPath === documentContextPath;
        });

        const updateTabs = state.get('tabs').get('byId').filter(tab => {
            return tab.get('contextPath') === documentContextPath;
        }).map(tab => {
            return tab.setIn(['workspace'], Immutable.fromJS({
                publishableNodes,
                publishableNodesInDocument
            }));
        });

        return updateActiveTabIfChanged(updateTabs.map(tab => tab.get('id')),
            state.mergeIn(['ui', 'tabs', 'byId'], updateTabs));
    },

    [ActionTypes.UI.CREATE_TAB](state, action) {
        return state.mergeIn(['ui', 'tabs', 'byId'], {
            [action.tabId]: {
                id: action.tabId,
                title: '...',
                src: action.src,
                workspace: {
                    publishableNodes: [],
                    publishableNodesInDocument: []
                }
            }
        });
    },

    [ActionTypes.UI.REMOVE_TAB](state, action) {
        return state.deleteIn(['ui', 'tabs', 'byId', action.tabId]);
    }
};
