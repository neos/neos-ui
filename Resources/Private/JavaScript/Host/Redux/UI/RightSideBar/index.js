import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $toggle, $drop} from 'plow-js';

const TOGGLE = '@neos/neos-ui/UI/RightSidebar/TOGGLE';
const INSPECTOR_WRITE_VALUE = '@neos/neos-ui/UI/RightSidebar/INSPECTOR_WRITE_VALUE';
const INSPECTOR_APPLY = '@neos/neos-ui/UI/RightSidebar/INSPECTOR_APPLY';
const INSPECTOR_CANCEL = '@neos/neos-ui/UI/RightSidebar/INSPECTOR_CANCEL';

/**
 * Toggles the right sidebar out/in of the users viewport.
 */
const toggle = createAction(TOGGLE);
const inspectorWriteValue = createAction(INSPECTOR_WRITE_VALUE, (nodeContextPath, propertyId, value) => ({nodeContextPath, propertyId, value}));
const inspectorApply = createAction(INSPECTOR_APPLY, (nodeContextPath) => ({nodeContextPath}));
const inspectorCancel = createAction(INSPECTOR_CANCEL, (nodeContextPath) => ({nodeContextPath}));

//
// Export the actions
//
export const actions = {
    toggle,
    inspectorWriteValue,
    inspectorApply,
    inspectorCancel
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
    [INSPECTOR_WRITE_VALUE]: ({nodeContextPath, propertyId, value}) => $set(['ui', 'rightSideBar', 'inspectorValuesByNodePath', nodeContextPath, propertyId], value),
        // TODO: how to apply?
    //[INSPECTOR_APPLY]: ({nodeContextPath}) => $drop(['ui', 'rightSideBar', 'inspectorValuesByNodePath', nodeContextPath], value)
    [INSPECTOR_CANCEL]: ({nodeContextPath}) => $drop(['ui', 'rightSideBar', 'inspectorValuesByNodePath', nodeContextPath])
};
