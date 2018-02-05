import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const UPDATE = '@neos/neos-ui/CR/Workspaces/UPDATE';
const PUBLISH = '@neos/neos-ui/CR/Workspaces/PUBLISH';
const COMMENCE_DISCARD = '@neos/neos-ui/CR/Workspaces/COMMENCE_DISCARD';
const DISCARD_ABORTED = '@neos/neos-ui/CR/Workspaces/DISCARD_ABORTED';
const DISCARD_CONFIRMED = '@neos/neos-ui/CR/Workspaces/DISCARD_CONFIRMED';
const CHANGE_BASE_WORKSPACE = '@neos/neos-ui/CR/Workspaces/CHANGE_BASE_WORKSPACE';

export const actionTypes = {
    UPDATE,
    PUBLISH,
    COMMENCE_DISCARD,
    DISCARD_ABORTED,
    DISCARD_CONFIRMED,
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
 * Start node discard workflow
 *
 * @param {String} contextPath The contexts paths of the nodes to be discarded
 */
const commenceDiscard = createAction(COMMENCE_DISCARD, nodeContextPaths => nodeContextPaths);

/**
 * Abort the ongoing node discard workflow
 */
const abortDiscard = createAction(DISCARD_ABORTED);

/**
 * Confirm the ongoing discard
 */
const confirmDiscard = createAction(DISCARD_CONFIRMED);

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
    commenceDiscard,
    abortDiscard,
    confirmDiscard,
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
    [COMMENCE_DISCARD]: nodeContextPaths => $set('cr.workspaces.toBeDiscarded', nodeContextPaths),
    [DISCARD_ABORTED]: () => $set('cr.workspaces.toBeDiscarded', null),
    [DISCARD_CONFIRMED]: () => $set('cr.workspaces.toBeDiscarded', null),
    [UPDATE]: data => $set('cr.workspaces.personalWorkspace', Immutable.fromJS(data))
});

//
// Export the selectors
//
export {selectors};
