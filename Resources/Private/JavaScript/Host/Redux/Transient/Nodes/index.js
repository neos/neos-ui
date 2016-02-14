import Immutable from 'immutable';
import {createAction, handleActions} from 'redux-actions';

import {immutableOperations} from 'Shared/Utilities/';
import {events as Events} from 'Shared/Constants/';

const {HOST_NODE_FOCUSED} = Events;
const {$set, $get, $merge} = immutableOperations;

const ADD = '@packagefactory/guevara/Transient/Nodes/ADD';
const ADD_BULK = '@packagefactory/guevara/Transient/Nodes/ADD_BULK';
const FOCUS = '@packagefactory/guevara/Transient/Nodes/FOCUS';
const BLUR = '@packagefactory/guevara/Transient/Nodes/BLUR';

/**
 * Adds a node to the application state
 *
 * @param {String} contextPath The context path of the ndoe
 * @param {Object} data        The node's data
 */
const add = createAction(ADD, (contextPath, data) => ({
    contextPath,
    data
}));

/**
 * Adds multiple nodes to the application state
 *
 * @param {Array} nodes A list of nodes
 */
const addBulk = createAction(ADD_BULK, nodes => ({nodes}));

/**
 * Marks a node as focused
 *
 * @param {String} contextPath The context path of the focused node
 */
const focus = createAction(FOCUS, (contextPath, typoscriptPath) => ({contextPath, typoscriptPath}));

/**
 * Marks a node as blurred
 *
 * @param {String} contextPath The context path of the blurred node
 */
const blur = createAction(BLUR, contextPath => ({contextPath}));

//
// Export the actions
//
export const actions = {
    add,
    addBulk,
    focus,
    blur
};

//
// Export the reducer
//
const initialState = Immutable.fromJS({
    byContextPath: {},
    focused: ''
});

export const reducer = handleActions({
    [ADD]: (state, action) => $set(state, ['byContextPath', action.payload.contextPath], action.payload.data),
    [ADD_BULK]: (state, action) => $merge(state, 'byContextPath', action.payload.nodes),
    [FOCUS]: (state, action) => $set(state, 'focused', action.payload.contextPath),
    [BLUR]: (state, action) => {
        if ($get(state, 'focused') === action.payload.contextPath) {
            return $set(state, 'focused', '');
        }

        return state;
    }
}, initialState);

//
// Export the event map
//
export const events = {
    [FOCUS]: {
        [HOST_NODE_FOCUSED]: (state, action) => {
            return {
                node: $get(state.transient.nodes, [
                    'byContextPath',
                    $get(state.transient.nodes, 'focused')
                ]),
                typoscriptPath: action.payload.typoscriptPath
            };
        }
    }
};
