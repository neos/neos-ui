import {createAction} from 'redux-actions';
import {$set, $drop} from 'plow-js';
import {Map} from 'immutable';

const WRITE_VALUE = '@packagefactory/guevara/UI/Inspector/WRITE_VALUE';
const APPLY = '@packagefactory/guevara/UI/Inspector/APPLY';
const APPLY_FINISHED = '@packagefactory/guevara/UI/Inspector/APPLY_FINISHED';
const CANCEL = '@packagefactory/guevara/UI/Inspector/CANCEL';

const writeValue = createAction(WRITE_VALUE, (nodeContextPath, propertyId, value) => ({nodeContextPath, propertyId, value}));
const apply = createAction(APPLY, (nodeContextPath) => ({nodeContextPath}));
const applyFinished = createAction(APPLY_FINISHED, (nodeContextPath) => ({nodeContextPath}));
const cancel = createAction(CANCEL, (nodeContextPath) => ({nodeContextPath}));

//
// Export the actions
//
export const actions = {
    writeValue,
    apply,
    applyFinished,
    cancel

};

export const actionTypes = {
    APPLY
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
    // APPLY is handled by a saga.
    // APPLY_FINISHED is only triggered by the saga which listens on APPLY.
    [APPLY_FINISHED]: ({nodeContextPath}) => $drop(['ui', 'inspector', 'valuesByNodePath', nodeContextPath]),
    // TODO: APPLY_FINISHED needs to UPDATE the Node properties on the client. Or should the "Changes" API do this? I guess yes.
    [CANCEL]: ({nodeContextPath}) => $drop(['ui', 'inspector', 'valuesByNodePath', nodeContextPath])
};
