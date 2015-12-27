import { ActionTypes } from '../../Constants';

function addConfiguration (documentId, configuration) {
    return {
        type: ActionTypes.Transient.DOCUMENT_ADD_CONFIGURATION,
        documentId,
        configuration
    }
}

function applyChange (documentId, change) {
    return {
        type: ActionTypes.Transient.DOCUMENT_APPLY_CHANGE,
        documentId,
        change
    }
}

export default {
    addConfiguration,
    applyChange
};
