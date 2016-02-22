import {createAction} from 'redux-actions';
import {$set, $merge} from 'plow-js';

const UPDATE = '@packagefactory/guevara/CR/Workspaces/UPDATE';
const SWITCH = '@packagefactory/guevara/CR/Workspaces/SWITCH';

/**
 * Updates the data of a workspace
 */
const update = createAction(UPDATE, (name, data) => ({name, data}));

/**
 * Switches to the given workspace
 */
const switchTo = createAction(SWITCH, name => name);

//
// Export the actions
//
export const actions = {
    update,
    switchTo
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
    [UPDATE]: ({name, data}) => $merge('cr.workspaces', {[name]: data}),
    [SWITCH]: name => $set('cr.workspaces.active', name)
};
