import {ActionTypes} from '../../Constants/';

export function addConfiguration(documentId, configuration) {
	return {
		type: ActionTypes.Transient.DOCUMENT_ADD_CONFIGURATION,
		documentId,
		configuration
	};
}

export function applyChange(documentId, change) {
	return {
		type: ActionTypes.Transient.DOCUMENT_APPLY_CHANGE,
		documentId,
		change
	};
}
