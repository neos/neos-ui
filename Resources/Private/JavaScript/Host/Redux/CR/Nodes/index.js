import {createAction} from 'redux-actions';
import {$set, $add, $get} from 'plow-js';

const ADD = '@packagefactory/guevara/Transient/Nodes/ADD';
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
    focus,
    blur,
    hover,
    unhover
};

//
// Export the initial state
//
export const initialState = {
    byContextPath: {},
    focused: {
        contextPath: '',
        typoscriptPath: ''
    },
    hovered: {
        contextPath: '',
        typoscriptPath: ''
    }
};

//
// Export the reducer
//
export const reducer = {
    [ADD]: ({contextPath, data}) => $add('cr.nodes.byContextPath', {
        [contextPath]: data
    }),
    [FOCUS]: ({contextPath, typoscriptPath}) => $set('cr.nodes.focused', {contextPath, typoscriptPath}),
    [BLUR]: ({contextPath}) => state => {
        if ($get('cr.nodes.focused.contextPath', state) === contextPath) {
            return $set('cr.nodes.focused', initialState.focused, state);
        }

        return state;
    },
    [HOVER]: ({contextPath, typoscriptPath}) => $set('cr.nodes.hovered', {contextPath, typoscriptPath}),
    [UNHOVER]: ({contextPath}) => state => {
        if ($get('cr.nodes.hovered.contextPath', state) === contextPath) {
            return $set('cr.nodes.hovered', initialState.hovered, state);
        }

        return state;
    }
};
