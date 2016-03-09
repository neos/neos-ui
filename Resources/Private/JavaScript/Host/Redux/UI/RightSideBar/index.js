import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $toggle} from 'plow-js';

const TOGGLE = '@neos/neos-ui/UI/RightSidebar/TOGGLE';
const INSPECTOR_WRITE_VALUE = '@neos/neos-ui/UI/RightSidebar/INSPECTOR_WRITE_VALUE';

/**
 * Toggles the right sidebar out/in of the users viewport.
 */
const toggle = createAction(TOGGLE);
const inspectorWriteValue = createAction(INSPECTOR_WRITE_VALUE, (nodeContextPath, propertyId, value) => ({nodeContextPath, propertyId, value}));

//
// Export the actions
//
export const actions = {
    toggle,
    inspectorWriteValue
};

//
// Export the initial state hydrator
//
export const hydrate = () => $set(
    'ui.rightSideBar',
    new Map({
        isHidden: false,
        inspectorValuesByNodePath: new Map()
    })
);

//
// Export the reducer
//
export const reducer = {
    [TOGGLE]: () => $toggle('ui.rightSideBar.isHidden'),
    [INSPECTOR_WRITE_VALUE]: ({nodeContextPath, propertyId, value}) => $set(['ui', 'rightSideBar', 'inspectorValuesByNodePath', nodeContextPath, propertyId], value)
};
