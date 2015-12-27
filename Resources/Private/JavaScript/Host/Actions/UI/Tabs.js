import { ActionTypes } from '../../Constants';

function switchToTab (tabId) {
    return {
        type: ActionTypes.UI.SET_ACTIVE_TAB,
        tabId
    }
}

function setTabTitle (tabId, title) {
    return {
        type: ActionTypes.UI.SET_TAB_TITLE,
        tabId,
        title
    }
}

export default {
    switchToTab,
    setTabTitle
};
