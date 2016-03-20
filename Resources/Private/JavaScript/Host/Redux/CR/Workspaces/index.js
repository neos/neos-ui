import {createAction} from 'redux-actions';
import {$set, $get} from 'plow-js';

const UPDATE = '@packagefactory/guevara/CR/Workspaces/UPDATE';
const SWITCH = '@packagefactory/guevara/CR/Workspaces/SWITCH';
const PUBLISH = '@packagefactory/guevara/CR/Workspaces/PUBLISH';
const DISCARD = '@packagefactory/guevara/CR/Workspaces/DISCARD';

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
// Export the initial state
//
export const initialState = {
    byName: {},
    active: ''
};

//
// Export the reducer
//
export const reducer = {
    [UPDATE]: ({name, data}) => $set(['cr', 'workspaces', 'byName', name, 'publishableNodes'], data),
    [SWITCH]: name => $set('cr.workspaces.active', name)
};
