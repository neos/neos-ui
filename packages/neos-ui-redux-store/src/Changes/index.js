import {createAction} from 'redux-actions';
import {$set, $all} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

const PERSIST = '@neos/neos-ui/Transient/Changes/PERSIST';

//
// Export the action types
//
export const actionTypes = {
    PERSIST
};

/**
 * Perists an array of changes.
 * Example:
 * changes: [{
 *   type: 'Neos.Neos.Ui:Property',
 *   subject: nodeContext.contextPath,
 *   payload: {
 *     propertyName: nodeContext.propertyName,
 *     value
 *   }
 * }]
 */
const persistChanges = createAction(PERSIST, changes => ({changes}));

//
// Export the actions
//
export const actions = {
    persistChanges
};

//
// Export the reducer
//
export const reducer = handleActions({
    [PERSIST]: ({changes}) => state => {
        return $all(
            ...changes.map(change => {
                if (change.type === 'Neos.Neos.Ui:Property') {
                    return $set(
                        ['cr', 'nodes', 'byContextPath', change.subject, 'properties', change.payload.propertyName],
                        change.payload.value
                    );
                }
                return null;
            }).filter(i => i),
            state
        );
    }
});

//
// Export the selectors
//
export const selectors = {};
