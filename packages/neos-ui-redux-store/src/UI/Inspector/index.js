import {createAction} from 'redux-actions';
import {$get, $set, $drop} from 'plow-js';
import Immutable, {Map} from 'immutable';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';
import {selectors as nodes} from '../../CR/Nodes/index';

import * as selectors from './selectors.js';

//
// System actions
//
const COMMIT = '@neos/neos-ui/UI/Inspector/COMMIT';
const CLEAR = '@neos/neos-ui/UI/Inspector/CLEAR';

//
// User actions, which are handled by a saga
//
const APPLY = '@neos/neos-ui/UI/Inspector/APPLY';
const DISCARD = '@neos/neos-ui/UI/Inspector/DISCARD';

//
// Export the action types
//

export const actionTypes = {
    COMMIT,
    CLEAR,
    APPLY,
    DISCARD
};

const commit = createAction(COMMIT, (propertyId, value, hooks) => ({propertyId, value, hooks}));
const clear = createAction(CLEAR);

const apply = createAction(APPLY);
const discard = createAction(DISCARD);

//
// Export the actions
//
export const actions = {
    commit,
    clear,
    apply,
    discard
};

const clearReducer = () => state => {
    const focusedNodePath = nodes.focusedNodePathSelector(state);
    return $drop(['ui', 'inspector', 'valuesByNodePath', focusedNodePath], state);
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.inspector',
        new Map({
            valuesByNodePath: new Map()
        })
    ),
    [COMMIT]: ({propertyId, value, hooks}) => state => {
        const focusedNode = nodes.focusedSelector(state);
        const focusedNodePath = $get('contextPath', focusedNode);
        const currentPropertyValue = $get(['properties', propertyId], focusedNode);
        const setValueForProperty = (data, state) =>
            $set(['ui', 'inspector', 'valuesByNodePath', focusedNodePath, propertyId], data, state);
        const transientValueDiffers = (value !== null) && (value !== currentPropertyValue);

        if (transientValueDiffers && hooks) {
            return setValueForProperty(Immutable.fromJS({value, hooks}), state);
        }

        if (transientValueDiffers) {
            return setValueForProperty(Immutable.fromJS({value}), state);
        }

        return $drop(['ui', 'inspector', 'valuesByNodePath', focusedNodePath, propertyId], state);
    },

    [DISCARD]: clearReducer,
    [CLEAR]: clearReducer
});

//
// Export the selectors
//

export {selectors};
