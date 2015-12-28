import {ActionTypes} from '../../Constants/';

export function addNode(contextPath, data) {
    return {
        type: ActionTypes.Transient.NODE_ADD,
        contextPath,
        data
    };
}

export function addNodeBulk(nodes) {
    return {
        type: ActionTypes.Transient.NODE_ADD_BULK,
        nodes
    };
}
