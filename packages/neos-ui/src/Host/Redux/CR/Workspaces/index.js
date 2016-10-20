import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$set, $head, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from 'Host/Redux/System/index';

const UPDATE = '@neos/neos-ui/CR/Workspaces/UPDATE';
const SWITCH = '@neos/neos-ui/CR/Workspaces/SWITCH';
const PUBLISH = '@neos/neos-ui/CR/Workspaces/PUBLISH';
const DISCARD = '@neos/neos-ui/CR/Workspaces/DISCARD';

export const actionTypes = {
    UPDATE,
    SWITCH,
    PUBLISH,
    DISCARD
};
/**
 * Updates the data of a workspace
 */
const update = createAction(UPDATE, (name, data) => ({name, data}));

/**
 * Switches to the given workspace
 */
const switchTo = createAction(SWITCH, name => name);

/**
 * Publish nodes to the given workspace
 */
const publish = createAction(PUBLISH, (nodeContextPaths, targetWorkspaceName) => ({nodeContextPaths, targetWorkspaceName}));

/**
 * Discard given nodes
 */
const discard = createAction(DISCARD, nodeContextPaths => nodeContextPaths);

//
// Export the actions
//
export const actions = {
    update,
    switchTo,
    publish,
    discard
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'cr.workspaces',
        new Map({
            byName: Immutable.fromJS($get('cr.workspaces.byName', state)),
            active: $get('cr.workspaces.active', state) || $head('cr.workspaces.byName', state)
        })
    ),
    [UPDATE]: ({name, data}) => $set(['cr', 'workspaces', 'byName', name, 'publishableNodes'], Immutable.fromJS(data)),
    [SWITCH]: name => $set('cr.workspaces.active', name)
});

//
// Export the selectors
//
export const selectors = {};
