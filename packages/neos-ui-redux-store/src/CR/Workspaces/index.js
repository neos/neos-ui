import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const UPDATE = '@neos/neos-ui/CR/Workspaces/UPDATE';
const PUBLISH = '@neos/neos-ui/CR/Workspaces/PUBLISH';
const DISCARD = '@neos/neos-ui/CR/Workspaces/DISCARD';
const CHANGE_BASE_WORKSPACE = '@neos/neos-ui/CR/Workspaces/CHANGE_BASE_WORKSPACE';

export const actionTypes = {
    UPDATE,
    PUBLISH,
    DISCARD,
    CHANGE_BASE_WORKSPACE
};
/**
 * Updates the data of a workspace
 */
const update = createAction(UPDATE, data => data);

/**
 * Publish nodes to the given workspace
 */
const publish = createAction(PUBLISH, (nodeContextPaths, targetWorkspaceName) => ({nodeContextPaths, targetWorkspaceName}));

/**
 * Discard given nodes
 */
const discard = createAction(DISCARD, nodeContextPaths => nodeContextPaths);

/**
 * Change base workspace
 */
const changeBaseWorkspace = createAction(CHANGE_BASE_WORKSPACE, name => name);

//
// Export the actions
//
export const actions = {
    update,
    publish,
    discard,
    changeBaseWorkspace
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'cr.workspaces',
        new Map({
            personalWorkspace: Immutable.fromJS($get('cr.workspaces.personalWorkspace', state))
        })
    ),
    [UPDATE]: data => $set('cr.workspaces.personalWorkspace', Immutable.fromJS(data))
});

//
// Export the selectors
//
export {selectors};
