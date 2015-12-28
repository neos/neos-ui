import {ActionTypes} from '../../Constants/';

export function switchToTab(tabId) {
	return {
		type: ActionTypes.UI.SET_ACTIVE_TAB,
		tabId
	};
}

export function setTabTitle(tabId, title) {
	return {
		type: ActionTypes.UI.SET_TAB_TITLE,
		tabId,
		title
	};
}
