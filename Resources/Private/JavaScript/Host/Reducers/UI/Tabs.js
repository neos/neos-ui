import {ActionTypes} from '../../Constants/';
import {immutableOperations} from '../../../Shared/Util/';

const {$immutable, $get, $set, $merge, $delete} = immutableOperations;

function updateActiveTab(state) {
    const activeTab = $get(state, 'ui.tabs.active');
    const activeTabId = $get(activeTab, 'id');
    const refreshedActiveTab = $get(state, `ui.tabs.byId`).get(activeTabId);

    return $set(state, 'ui.tabs.active', refreshedActiveTab);
}

export default {
    [ActionTypes.UI.SET_ACTIVE_TAB](state, action) {
        const newActiveTab = $get(state, 'ui.tabs.byId').get(action.tabId);

        return $set(state, 'ui.tabs.active', newActiveTab);
    },


    [ActionTypes.UI.SET_TAB_METADATA](state, action) {
        const {title, workspace, contextPath} = action.metaData;
        const {publishingState, name} = workspace;
        const {publishableNodes} = publishingState;
        const [nodePath] = contextPath.split('@');
        const publishableNodesInDocument = publishableNodes.filter(nodeEnvelope => {
            return nodeEnvelope.contextPath.startsWith(nodePath) &&
                nodeEnvelope.documentContextPath === contextPath;
        });

        return updateActiveTab($set(
            $merge(state, ['ui', 'tabs', 'byId', action.tabId], {title, contextPath}),
            ['ui', 'tabs', 'byId', action.tabId, 'workspace'],
            {
                name,
                publishingState: {
                    publishableNodes,
                    publishableNodesInDocument
                }
            }
        ));
    },

    [ActionTypes.UI.UPDATE_TAB_WORKSPACE_INFO](state, action) {
        const {documentContextPath, workspaceInfo, workspaceName} = action;
        const publishableNodes = workspaceInfo;
        const [nodePath] = documentContextPath.split('@');
        const publishableNodesInDocument = publishableNodes.filter(nodeEnvelope => {
            return nodeEnvelope.contextPath.startsWith(nodePath) &&
                nodeEnvelope.documentContextPath === documentContextPath;
        });

        const updateTabs = $get(state, 'ui.tabs.byId').filter(tab => {
            return $get(tab, 'workspace.name') === workspaceName;
        }).map(tab => {
            return $set(tab, 'workspace.publishingState', {publishableNodes, publishableNodesInDocument});
        });

        return updateActiveTab($merge(state, 'ui.tabs.byId', updateTabs));
    },

    [ActionTypes.UI.CREATE_TAB](state, action) {
        return $set(state, ['ui', 'tabs', 'byId', action.tabId], {
            id: action.tabId,
            title: '...',
            src: action.src,
            workspace: {
                name: '',
                publishingState: {
                    publishableNodes: [],
                    publishableNodesInDocument: []
                }
            }
        });
    },

    [ActionTypes.UI.REMOVE_TAB](state, action) {
        return $delete(state, ['ui', 'tabs', 'byId', action.tabId]);
    }
};
