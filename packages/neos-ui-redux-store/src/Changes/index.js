import {createAction} from 'redux-actions';
import {$set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

const PERSIST = '@neos/neos-ui/Transient/Changes/PERSIST';

//
// Export the action types
//
export const actionTypes = {
    PERSIST
};

/**
 * Perists the change.
 * Example:
 * change: {
 *   type: 'Neos.Neos.Ui:Property',
 *   subject: nodeContext.contextPath,
 *   payload: {
 *     propertyName: nodeContext.propertyName,
 *     value
 *   }
 * }
 */
const persistChange = createAction(PERSIST, change => ({change}));

//
// Export the actions
//
export const actions = {
    persistChange
};

//
// Export the reducer
//
export const reducer = handleActions({
    [PERSIST]: ({change}) => state =>  {
        if (change.type === 'Neos.Neos.Ui:Propery') {
            return $set(
                ['cr', 'nodes', 'byContextPath', change.subject, 'properties', change.payload.propertyName],
                change.payload.value
            );
        }

        return state;
    }
});

//
// Export the selectors
//
export const selectors = {};
