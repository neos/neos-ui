import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$all, $set, $drop, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const ADD = '@neos/neos-ui/Transient/Nodes/ADD';
const FOCUS = '@neos/neos-ui/Transient/Nodes/FOCUS';
const UNFOCUS = '@neos/neos-ui/Transient/Nodes/UNFOCUS';
const COMMENCE_REMOVAL = '@neos/neos-ui/Transient/Nodes/COMMENCE_REMOVAL';
const REMOVAL_ABORTED = '@neos/neos-ui/Transient/Nodes/REMOVAL_ABORTED';
const REMOVAL_CONFIRMED = '@neos/neos-ui/Transient/Nodes/REMOVAL_CONFIRMED';
const REMOVE = '@neos/neos-ui/Transient/Nodes/REMOVE';
const COPY = '@neos/neos-ui/Transient/Nodes/COPY';
const CUT = '@neos/neos-ui/Transient/Nodes/CUT';
const PASTE = '@neos/neos-ui/Transient/Nodes/PASTE';
const HIDE = '@neos/neos-ui/Transient/Nodes/HIDE';
const SHOW = '@neos/neos-ui/Transient/Nodes/SHOW';

//
// Export the action types
//
export const actionTypes = {
    ADD,
    FOCUS,
    UNFOCUS,
    COMMENCE_REMOVAL,
    REMOVAL_ABORTED,
    REMOVAL_CONFIRMED,
    REMOVE,
    COPY,
    CUT,
    PASTE,
    HIDE,
    SHOW
};

/**
 * Adds a node to the application state
 *
 * @param {Object} nodeMap A map of nodes, with contextPaths as key
 */
const add = createAction(ADD, nodeMap => ({nodeMap}));

/**
 * Marks a node as focused
 *
 * @param {String} contextPath The context path of the focused node
 * @param {String} fusionPath The fusion path of the focused node, needed for out-of-band-rendering, e.g. when
 *                            adding new nodes
 */
const focus = createAction(FOCUS, (contextPath, fusionPath) => ({contextPath, fusionPath}));

/**
 * Un-marks all nodes as not focused.
 */
const unFocus = createAction(UNFOCUS);

/**
 * Start node removal workflow
 *
 * @param {String} contextPath The context path of the node to be removed
 */
const commenceRemoval = createAction(COMMENCE_REMOVAL, contextPath => contextPath);

/**
 * Abort the ongoing node removal workflow
 */
const abortRemoval = createAction(REMOVAL_ABORTED);

/**
 * Confirm the ongoing removal
 */
const confirmRemoval = createAction(REMOVAL_CONFIRMED);

/**
 * Remove the node that was marked for removal
 *
 * @param {String} contextPath The context path of the node to be removed
 */
const remove = createAction(REMOVE, contextPath => contextPath);

/**
 * Mark a node for copy on paste
 *
 * @param {String} contextPath The context path of the node to be copied
 */
const copy = createAction(COPY, contextPath => contextPath);

/**
 * Mark a node for cut on paste
 *
 * @param {String} contextPath The context path of the node to be cut
 */
const cut = createAction(CUT, contextPath => contextPath);

/**
 * Paste the contents of the node clipboard
 *
 * @param {String} contextPath The context path of the target node
 * @param {String} fusionPath The fusion path of the target node, needed for out-of-band-rendering
 */
const paste = createAction(PASTE, (contextPath, fusionPath) => ({contextPath, fusionPath}));

/**
 * Hide the given node
 *
 * @param {String} contextPath The context path of the node to be hidden
 */
const hide = createAction(HIDE, contextPath => contextPath);

/**
 * Show the given node
 *
 * @param {String} contextPath The context path of the node to be shown
 */
const show = createAction(SHOW, contextPath => contextPath);

//
// Export the actions
//
export const actions = {
    add,
    focus,
    unFocus,
    commenceRemoval,
    abortRemoval,
    confirmRemoval,
    remove,
    copy,
    cut,
    paste,
    hide,
    show
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
                fusionPath: ''
            }),
            toBeRemoved: '',
            clipboard: ''
        })
    ),
    [ADD]: ({nodeMap}) => $all(
        ...Object.keys(nodeMap).map(contextPath => $set(
            ['cr', 'nodes', 'byContextPath', contextPath],
            Immutable.fromJS(
                //
                // the data is passed from *the guest iFrame*. Because of this, at least in Chrome, Immutable.fromJS() does not do anything;
                // as the object has a different prototype than the default "Object". For this reason, we need to JSON-encode-and-decode
                // the data, to scope it relative to *this* frame.
                //
                JSON.parse(JSON.stringify(nodeMap[contextPath]))
            )
        ))
    ),
    [FOCUS]: ({contextPath, fusionPath}) => $set('cr.nodes.focused', new Map({contextPath, fusionPath})),
    [UNFOCUS]: () => $set('cr.nodes.focused', new Map({
        contextPath: '',
        fusionPath: ''
    })),
    [COMMENCE_REMOVAL]: contextPath => $set('cr.nodes.toBeRemoved', contextPath),
    [REMOVAL_ABORTED]: () => $set('cr.nodes.toBeRemoved', ''),
    [REMOVAL_CONFIRMED]: () => $set('cr.nodes.toBeRemoved', ''),
    [REMOVE]: contextPath => $drop(['cr', 'nodes', 'byContextPath', contextPath]),
    [COPY]: contextPath => $set('cr.nodes.clipboard', contextPath),
    [CUT]: contextPath => $set('cr.nodes.clipboard', contextPath),
    [PASTE]: () => $set('cr.nodes.clipboard', ''),
    [HIDE]: contextPath => $set(['cr', 'nodes', 'byContextPath', contextPath, 'properties', '_hidden'], true),
    [SHOW]: contextPath => $set(['cr', 'nodes', 'byContextPath', contextPath, 'properties', '_hidden'], false)
});

//
// Export the selectors
//
export {selectors};
