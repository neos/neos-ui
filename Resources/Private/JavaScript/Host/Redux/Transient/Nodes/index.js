import {immutableOperations} from 'Shared/Util/';

const {$set, $merge} = immutableOperations;

const ADD = '@packagefactory/guevara/Transient/Nodes/ADD';
const ADD_BULK = '@packagefactory/guevara/Transient/Nodes/ADD_BULK';

export default function reducer(state, action) {
    switch (action.type) {
        case ADD:
            return $set(state, ['nodes', 'byContextPath', action.contextPath], action.data);

        case ADD_BULK:
            return $merge(state, 'nodes.byContextPath', state.nodes);

        default: return state;
    }
}

/**
 * Adds a node to the application state
 *
 * @param {String} contextPath The context path of the ndoe
 * @param {Object} data        The node's data
 */
export function add(contextPath, data) {
    return {
        type: ADD,
        contextPath,
        data
    };
}

/**
 * Adds multiple nodes to the application state
 *
 * @param {Array} nodes A list of nodes
 */
export function addBulk(nodes) {
    return {
        type: ADD_BULK,
        nodes
    };
}
