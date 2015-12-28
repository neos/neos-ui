import {ActionTypes} from '../../Constants/';

export default {
    [ActionTypes.UI.SET_ACTIVE_TAB](state, action) {
        return state.mergeDeep({
            tabs: {
                active: action.tabId
            }
        });
    },

    [ActionTypes.UI.SET_TAB_TITLE](state, action) {
        return state.mergeDeep({
            tabs: {
                byId: {
                    [action.tabId]: {
                        title: action.title
                    }
                }
            }
        });
    },

    [ActionTypes.UI.CREATE_TAB](state, action) {
        return state.mergeDeep({
            tabs: {
                active: action.tabId,
                byId: {
                    [action.tabId]: {
                        id: action.tabId,
                        title: '...',
                        src: action.src
                    }
                }
            }
        });
    },

    [ActionTypes.UI.REMOVE_TAB](state, action) {
        return state.mergeDeep({
            tabs: {
                byId: {
                    [action.tabId]: null
                }
            }
        });
    }
};
