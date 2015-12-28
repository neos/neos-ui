import {ActionTypes} from '../../Constants/';

export default {
    [ActionTypes.Transient.NODE_ADD](state, action) {
        return state.mergeDeep({
            nodes: {
                byContextPath: {
                    [action.contextPath]: action.data
                }
            }
        });
    },

    [ActionTypes.Transient.NODE_ADD_BULK](state, action) {
        return state.mergeDeep({
            nodes: {
                byContextPath: action.nodes
            }
        });
    }
};
