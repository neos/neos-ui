import {createAction} from 'redux-actions';
import {$set, $toggle, $drop} from 'plow-js';

const WRITE_VALUE = '@packagefactory/guevara/UI/Inspector/WRITE_VALUE';
const APPLY = '@packagefactory/guevara/UI/Inspector/APPLY';
const CANCEL = '@packagefactory/guevara/UI/Inspector/CANCEL';

/**
 * Toggles the right sidebar out/in of the users viewport.
 */
const writeValue = createAction(WRITE_VALUE, (nodeContextPath, propertyId, value) => ({nodeContextPath, propertyId, value}));
const apply = createAction(APPLY, (nodeContextPath) => ({nodeContextPath}));
const cancel = createAction(CANCEL, (nodeContextPath) => ({nodeContextPath}));

//
// Export the actions
//
export const actions = {
    writeValue,
    apply,
    cancel
};

//
// Export the initial state hydrator
//
export const hydrate = () => $set(
    'ui.inspector',
    new Map({
        valuesByNodePath: new Map()
    })
);

//
// Export the reducer
//
export const reducer = {
    [WRITE_VALUE]: ({nodeContextPath, propertyId, value}) => $set(['ui', 'inspector', 'valuesByNodePath', nodeContextPath, propertyId], value),
        // TODO: how to apply?
    //[APPLY]: ({nodeContextPath}) => $drop(['ui', 'rightSideBar', 'inspectorValuesByNodePath', nodeContextPath], value)
    [CANCEL]: ({nodeContextPath}) => $drop(['ui', 'rightSideBar', 'valuesByNodePath', nodeContextPath])
};
