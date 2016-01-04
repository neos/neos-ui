import {immutableOperations} from '../../../Shared/Util/';

const {$get, $set, $merge, $delete} = immutableOperations;

export const ADD = '@packagefactory/guevara/UI/Tabs/ADD';
export const REMOVE = '@packagefactory/guevara/UI/Tabs/REMOVE';
export const SET_ACTIVE = '@packagefactory/guevara/UI/Tabs/SET_ACTIVE';
export const SET_METADATA = '@packagefactory/guevara/UI/Tabs/SET_METADATA';
export const UPDATE_WORKSPACE_INFO = '@packagefactory/guevara/UI/Tabs/UPDATE_WORKSPACE_INFO';

/**
 * Helper function to make updating the active tab data easier
 *
 * @private
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function updateActiveTab(state) {
    const activeTab = $get(state, 'ui.tabs.active');
    const activeTabId = $get(activeTab, 'id');
    const refreshedActiveTab = $get(state, `ui.tabs.byId`).get(activeTabId);

    return $set(state, 'ui.tabs.active', refreshedActiveTab);
}

export default funtion reducer (state, action) {
    switch(action.type) {

        case ADD:
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

        case REMOVE:
            return $delete(state, ['ui', 'tabs', 'byId', action.tabId]);

        case SET_ACTIVE:
            const newActiveTab = $get(state, 'ui.tabs.byId').get(action.tabId);

            return $set(state, 'ui.tabs.active', newActiveTab);

        case SET_METADATA:
            const {title, workspace, contextPath} = action.metaData;
            const {publishingState, name} = workspace;
            const {publishableNodes} = publishingState;
            const [nodePath] = contextPath.split('@');
            const publishableNodesInDocument = publishableNodes.filter(nodeEnvelope =>
                nodeEnvelope.contextPath.startsWith(nodePath) &&
                nodeEnvelope.documentContextPath === contextPath
            );

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

        case UPDATE_WORKSPACE_INFO:
            const {documentContextPath, workspaceInfo, workspaceName} = action;
            const publishableNodes = workspaceInfo;
            const [nodePath] = documentContextPath.split('@');
            const publishableNodesInDocument = publishableNodes.filter(nodeEnvelope =>
                nodeEnvelope.contextPath.startsWith(nodePath) &&
                nodeEnvelope.documentContextPath === documentContextPath
            );

            const updateTabs = $get(state, 'ui.tabs.byId').filter(tab =>
                $get(tab, 'workspace.name') === workspaceName
            ).map(tab =>
                $set(tab, 'workspace.publishingState', {publishableNodes, publishableNodesInDocument})
            );

            return updateActiveTab($merge(state, 'ui.tabs.byId', updateTabs));

        default: return state;

    }
}

/**
 * Adds a new tab
 *
 * @param {String} tabId must be unique within the ui.tabs portion of the store
 * @param {String} src
 * @return {Object}
 */
export function add(tabId, src) {
    return {
        type: ADD,
        tabId,
        src
    };
}

/**
 * Removes a tab
 *
 * @param {String} tabId
 * @return {Object}
 */
export function remove(tabId) {
    return {
        type: REMOVE,
        tabId
    };
}

/**
 * Sets the active tab
 *
 * @param  {String} tabId
 * @return {Object}
 */
export function switchTo(tabId) {
    return {
        type: SET_ACTIVE,
        tabId
    };
}

/**
 * Sets the meta data for a tab (e.g. title, workspace info)
 *
 * @param {String} tabId
 * @param {Object} metaData
 * @return {Object}
 */
export function setMetaData(tabId, metaData) {
    return {
        type: SET_METADATA,
        tabId,
        metaData
    };
}

/**
 * Sets new workspace info for the given workspace in all tabs that are showing a document with the
 * given context path
 *
 * @param  {String} documentContextPath
 * @param  {String} workspaceName
 * @param  {Object} workspaceInfo
 * @return {Object}
 */
export function updateWorkspaceInfo(documentContextPath, workspaceName, workspaceInfo) {
    return {
        type: UPDATE_WORKSPACE_INFO,
        documentContextPath,
        workspaceName,
        workspaceInfo
    };
}
