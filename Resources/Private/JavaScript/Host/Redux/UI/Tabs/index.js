import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set, $merge, $delete} = immutableOperations;

const ADD = '@packagefactory/guevara/UI/Tabs/ADD';
const REMOVE = '@packagefactory/guevara/UI/Tabs/REMOVE';
const SET_ACTIVE = '@packagefactory/guevara/UI/Tabs/SET_ACTIVE';
const SET_METADATA = '@packagefactory/guevara/UI/Tabs/SET_METADATA';
const UPDATE_WORKSPACE_INFO = '@packagefactory/guevara/UI/Tabs/UPDATE_WORKSPACE_INFO';

/**
 * Helper function to make updating the active tab data easier.
 *
 * @private
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function updateActiveTab(state) {
    const activeTab = $get(state, 'active');

    if (!activeTab) {
        return state;
    }

    const activeTabId = $get(activeTab, 'id');
    const refreshedActiveTab = $get(state, `byId`).get(activeTabId);

    return $set(state, 'active', refreshedActiveTab);
}

/**
 * Helper function to perfrom the SET_METADATA action.
 *
 * @param  {Immutable.Collection} state
 * @param  {Object} action
 * @return {Immutable.Collection}
 */
function doSetMetaData(state, payload) {
    const {title, workspace, contextPath} = payload.metaData;
    const {publishingState, name} = workspace;
    const {publishableNodes} = publishingState;
    const [nodePath] = contextPath.split('@');
    const publishableNodesInDocument = publishableNodes.filter(nodeEnvelope =>
        nodeEnvelope.contextPath.startsWith(nodePath) &&
        nodeEnvelope.documentContextPath === contextPath
    );

    return updateActiveTab($set(
        $merge(state, ['byId', payload.tabId], {title, contextPath}),
        ['byId', payload.tabId, 'workspace'],
        {
            name,
            publishingState: {
                publishableNodes,
                publishableNodesInDocument
            }
        }
    ));
}

/**
 * Helper function to perfrom the UPDATE_WORKSPACE_INFO action.
 *
 * @param  {Immutable.Collection} state
 * @param  {Object} action
 * @return {Immutable.Collection}
 */
function doUpdateWorkspaceInfo(state, payload) {
    const {documentContextPath, workspaceInfo, workspaceName} = payload;
    const publishableNodes = workspaceInfo;
    const [nodePath] = documentContextPath.split('@');
    const publishableNodesInDocument = publishableNodes.filter(nodeEnvelope =>
        nodeEnvelope.contextPath.startsWith(nodePath) &&
        nodeEnvelope.documentContextPath === documentContextPath
    );

    const updateTabs = $get(state, 'byId').filter(tab =>
        $get(tab, 'workspace.name') === workspaceName
    ).map(tab =>
        $set(tab, 'workspace.publishingState', {publishableNodes, publishableNodesInDocument})
    );

    return updateActiveTab($merge(state, 'byId', updateTabs));
}

/**
 * Adds a new tab.
 *
 * @param {String} tabId must be unique within the ui.tabs portion of the store
 * @param {String} src
 */
const add = createAction(ADD, (tabId, src) => ({
    tabId,
    src
}));

/**
 * Removes a tab for the given id.
 *
 * @param {String} tabId}
 */
const remove = createAction(REMOVE, tabId => ({
    tabId
}));

/**
 * Sets the active tab to the given id.
 *
 * @param  {String} tabId
 */
const switchTo = createAction(SET_ACTIVE, tabId => ({
    tabId
}));

/**
 * Sets the meta data for a tab (e.g. title, workspace info)
 *
 * @param {String} tabId
 * @param {Object} metaData
 */
const setMetaData = createAction(SET_METADATA, (tabId, metaData) => ({
    tabId,
    metaData
}));

/**
 * Sets new workspace info for the given workspace in all tabs that are showing a document with the
 * given context path
 *
 * @param  {String} documentContextPath
 * @param  {String} workspaceName
 * @param  {Object} workspaceInfo
 */
const updateWorkspaceInfo = createAction(
    UPDATE_WORKSPACE_INFO,
    (documentContextPath, workspaceName, workspaceInfo) => ({
        documentContextPath,
        workspaceName,
        workspaceInfo
    })
);

//
// Export the actions
//
export const actions = {
    add,
    remove,
    switchTo,
    setMetaData,
    updateWorkspaceInfo
};

//
// Export the reducer
//
const initialState = Immutable.fromJS({
    byId: {},
    active: {
        id: '',
        workspace: {
            name: '',
            publishingState: {
                publishableNodes: [],
                publishableNodesInDocument: []
            }
        }
    }
});

export const reducer = handleActions({
    [ADD]: (state, action) => {
        const {payload} = action;

        return $set(state, ['byId', payload.tabId], {
            id: payload.tabId,
            title: '...',
            src: payload.src,
            workspace: {
                name: '',
                publishingState: {
                    publishableNodes: [],
                    publishableNodesInDocument: []
                }
            }
        });
    },
    [REMOVE]: (state, action) => $delete(state, ['byId', action.payload.tabId]),
    [SET_ACTIVE]: (state, action) => {
        const newActiveTab = $get(state, 'byId').get(action.payload.tabId);

        return $set(state, 'active', newActiveTab);
    },
    [SET_METADATA]: (state, action) => doSetMetaData(state, action.payload),
    [UPDATE_WORKSPACE_INFO]: (state, action) => doUpdateWorkspaceInfo(state, action.payload)
}, initialState);
