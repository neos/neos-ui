import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const ADD = '@neos/neos-ui/Transient/Nodes/ADD';
const FOCUS = '@neos/neos-ui/Transient/Nodes/FOCUS';
const UNFOCUS = '@neos/neos-ui/Transient/Nodes/UNFOCUS';

//
// Export the action types
//
export const actionTypes = {
    ADD,
    FOCUS,
    UNFOCUS
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

//
// Export the actions
//
export const actions = {
    add,
    focus,
    unFocus
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'cr.nodes',
        new Map({
            byContextPath: Immutable.fromJS($get('cr.nodes.byContextPath', state)) || new Map(),
            siteNode: $get('cr.nodes.siteNode', state) || '',
            focused: new Map({
                contextPath: '',
                typoscriptPath: ''
            })
        })
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
    }))
});

//
// Export the selectors
//
export {selectors};
