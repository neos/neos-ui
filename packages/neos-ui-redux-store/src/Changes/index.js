import {createAction} from 'redux-actions';

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
// Export the selectors
//
export const selectors = {};
