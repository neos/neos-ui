import {createAction} from 'redux-actions';
import {$set} from 'plow-js';

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
 *   type: 'PackageFactory.Guevara:Property',
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
export const reducer = {
    [PERSIST]: ({change}) => $set(['cr', 'nodes', 'byContextPath', change.subject, 'properties', change.payload.propertyName], change.payload.value)
};
