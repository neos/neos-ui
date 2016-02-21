import Immutable from 'immutable';
import {createAction, handleActions} from 'redux-actions';

import {immutableOperations} from 'Shared/Utilities/';

const {$set, $get, $merge} = immutableOperations;

const ADD = '@packagefactory/guevara/Transient/Nodes/ADD';
const ADD_BULK = '@packagefactory/guevara/Transient/Nodes/ADD_BULK';
const FOCUS = '@packagefactory/guevara/Transient/Nodes/FOCUS';
const BLUR = '@packagefactory/guevara/Transient/Nodes/BLUR';
const HOVER = '@packagefactory/guevara/Transient/Nodes/HOVER';
const UNHOVER = '@packagefactory/guevara/Transient/Nodes/UNHOVER';

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
 * @param {String} typoscriptPath The typoscript path of the focused node
 */
const focus = createAction(FOCUS, (contextPath, typoscriptPath) => ({contextPath, typoscriptPath}));

/**
 * Marks a node as hovered
 *
 * @param {String} contextPath The context path of the hovered node
 * @param {String} typoscriptPath The typoscript path of the hovered node
 */
const hover = createAction(HOVER, (contextPath, typoscriptPath) => ({contextPath, typoscriptPath}));

/**
 * Marks a node as blurred
 *
 * @param {String} contextPath The context path of the blurred node
 */
const blur = createAction(BLUR, contextPath => ({contextPath}));

/**
 * Marks a node as unhovered
 *
 * @param {String} contextPath The context path of the unhovered node
 */
const unhover = createAction(UNHOVER, contextPath => ({contextPath}));

//
// Export the actions
//
export const actions = {
    add,
    addBulk,
    focus,
    blur,
    hover,
    unhover
};

//
// Export the reducer
//
const initialState = Immutable.fromJS({
    byContextPath: {},
    focused: {
        contextPath: '',
        typoscriptPath: ''
    },
    hovered: {
        contextPath: '',
        typoscriptPath: ''
    }
});

export const reducer = handleActions({
    [ADD]: (state, action) => $set(state, ['byContextPath', action.payload.contextPath], action.payload.data),
    [ADD_BULK]: (state, action) => $merge(state, 'byContextPath', action.payload.nodes),
    [FOCUS]: (state, action) => $set(state, 'focused', {
        contextPath: action.payload.contextPath,
        typoscriptPath: action.payload.typoscriptPath
    }),
    [BLUR]: (state, action) => {
        if ($get(state, 'focused.contextPath') === action.payload.contextPath) {
            return $set(state, 'focused', {
                contextPath: '',
                typoscriptPath: ''
            });
        }

        return state;
    },
    [HOVER]: (state, action) => $set(state, 'hovered', {
        contextPath: action.payload.contextPath,
        typoscriptPath: action.payload.typoscriptPath
    }),
    [UNHOVER]: (state, action) => {
        if ($get(state, 'hovered.contextPath') === action.payload.contextPath) {
            return $set(state, 'hovered', {
                contextPath: '',
                typoscriptPath: ''
            });
        }

        return state;
    }
}, initialState);
