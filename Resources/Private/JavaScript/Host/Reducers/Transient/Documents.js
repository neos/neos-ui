import { ActionTypes } from '../../Constants';

export default {
    [ActionTypes.Transient.DOCUMENT_ADD_CONFIGURATION] (state, action) {
        return state.mergeDeep({
            documents: {
                byId: {
                    [action.documentId]: action.configuration
                }
            }
        });
    },

    [ActionTypes.Transient.DOCUMENT_APPLY_CHANGE] (state, action) {
        return state.mergeDeep({
            documents: {
                byId: {
                    [action.documentId]: action.change
                }
            }
        });
    }
};
