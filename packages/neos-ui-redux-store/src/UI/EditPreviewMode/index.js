import {createAction} from 'redux-actions';
import {Immutable, Map} from 'immutable';
import {$get, $set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const SET = '@neos/neos-ui/UI/EditPreviewMode/SET';

//
// Export the action types
//
export const actionTypes = {
    SET
};

/**
 * Sets the currently active edit/preview mode
 */
const set = createAction(SET, editPreviewMode => ({editPreviewMode}));

//
// Export the actions
//
export const actions = {
    set
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'ui.editPreviewMode',
        $get('ui.editPreviewMode', state)
    ),
    [SET]: ({editPreviewMode}) => state => $set('ui.editPreviewMode', editPreviewMode)
});

//
// Export the selectors
//
export const selectors = {};
