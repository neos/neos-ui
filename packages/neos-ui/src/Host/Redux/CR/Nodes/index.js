import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

const ADD = '@neos/neos-ui/Transient/Nodes/ADD';
const FOCUS = '@neos/neos-ui/Transient/Nodes/FOCUS';
const UNFOCUS = '@neos/neos-ui/Transient/Nodes/UNFOCUS';
const BLUR = '@neos/neos-ui/Transient/Nodes/BLUR';
const HOVER = '@neos/neos-ui/Transient/Nodes/HOVER';
const UNHOVER = '@neos/neos-ui/Transient/Nodes/UNHOVER';

//
// Export the action types
//
export const actionTypes = {
    ADD,
    FOCUS,
    UNFOCUS,
    BLUR,
    HOVER,
    UNHOVER
};

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
 * Un-marks all nodes as not focused.
 */
const unFocus = createAction(UNFOCUS);

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
    unFocus,
    blur,
    hover,
    unhover
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => state => $set(
        'cr.nodes',
        new Map({
            byContextPath: Immutable.fromJS($get('cr.nodes.byContextPath', state)) || new Map(),
            siteNode: $get('cr.nodes.siteNode', state) || '',
            focused: new Map({
                contextPath: '',
                typoscriptPath: ''
            }),
            hovered: new Map({
                contextPath: '',
                typoscriptPath: ''
            })
        }),
        state
    ),
    [ADD]: ({contextPath, data}) => state => {
        // the data is passed from *the guest iFrame*. Because of this, at least in Chrome, Immutable.fromJS() does not do anything;
        // as the object has a different prototype than the default "Object". For this reason, we need to JSON-encode-and-decode
        // the data, to scope it relative to *this* frame.
        data = JSON.parse(JSON.stringify(data));
        return $set(['cr', 'nodes', 'byContextPath', contextPath], Immutable.fromJS(data), state);
    },
    [FOCUS]: ({contextPath, typoscriptPath}) => $set('cr.nodes.focused', new Map({contextPath, typoscriptPath})),
    [UNFOCUS]: () => $set('cr.nodes.focused', new Map({
        contextPath: '',
        typoscriptPath: ''
    })),
    [BLUR]: ({contextPath}) => state => {
        if ($get('cr.nodes.focused.contextPath', state) === contextPath) {
            return $set('cr.nodes.focused', '', state);
        }

        return state;
    },
    [HOVER]: ({contextPath, typoscriptPath}) => $set('cr.nodes.hovered', new Map({contextPath, typoscriptPath})),
    [UNHOVER]: ({contextPath}) => state => {
        if ($get('cr.nodes.hovered.contextPath', state) === contextPath) {
            return $set('cr.nodes.hovered', '', state);
        }

        return state;
    }
});

//
// Export the selectors
//
export const selectors = {};
