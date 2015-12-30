import {ActionTypes} from '../../Constants/';

export function switchToTab(tabId) {
    return {
        type: ActionTypes.UI.SET_ACTIVE_TAB,
        tabId
    };
}

export function setTabMetaData(tabId, metaData) {
    return {
        type: ActionTypes.UI.SET_TAB_METADATA,
        tabId,
        metaData
    };
}

export function updateWorkspaceInfo(documentContextPath, workspaceInfo) {
    return {
        type: ActionTypes.UI.UPDATE_TAB_WORKSPACE_INFO,
        documentContextPath,
        workspaceInfo
    };
}

export function removeTab(tabId) {
    return {
        type: ActionTypes.UI.REMOVE_TAB,
        tabId
    };
}

export function createTab(tabId, src) {
    return {
        type: ActionTypes.UI.CREATE_TAB,
        tabId,
        src
    };
}
