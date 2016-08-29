import {createAction} from 'redux-actions';
import {$get, $all, $set, $drop} from 'plow-js';
import Immutable, {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

//
// System actions
//
const RESET = '@packagefactory/guevara/UI/Inspector/RESET';
const LOAD = '@packagefactory/guevara/UI/Inspector/LOAD';
const COMMIT = '@packagefactory/guevara/UI/Inspector/COMMIT';
const CLEAR = '@packagefactory/guevara/UI/Inspector/CLEAR';

//
// User actions, which are handled by a saga
//
const APPLY = '@packagefactory/guevara/UI/Inspector/APPLY';
const DISCARD = '@packagefactory/guevara/UI/Inspector/DISCARD';

const reset = createAction(RESET);
const load = createAction(LOAD, (viewConfiguration, activeNodePath) => ({viewConfiguration, activeNodePath}));
const commit = createAction(COMMIT, (propertyId, value, hooks) => ({propertyId, value, hooks}));
const clear = createAction(CLEAR);

const apply = createAction(APPLY, () => ({}));
const discard = createAction(DISCARD, () => ({}));

//
// Export the actions
//
export const actions = {
    reset,
    load,
    commit,
    clear,
    apply,
    discard
};

export const actionTypes = {
    RESET,
    LOAD,
    COMMIT,
    CLEAR,
    APPLY,
    DISCARD
};

const clearReducer = () => state => {
    const activeNodePath = $get('ui.inspector.activeNodePath', state);
    return $drop(['ui', 'inspector', 'valuesByNodePath', activeNodePath], state);
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.inspector',
        new Map({
            activeNodePath: '',
            viewConfiguration: new Map(),
            valuesByNodePath: new Map()
        })
    ),
    [RESET]: () => $set('ui.inspector.activeNodePath', ''),
    [LOAD]: ({viewConfiguration, activeNodePath}) => $all(
        $set('ui.inspector.viewConfiguration', viewConfiguration),
        $set('ui.inspector.activeNodePath', activeNodePath)
    ),
    [COMMIT]: ({propertyId, value, hooks}) => state => {
        const activeNodePath = $get('ui.inspector.activeNodePath', state);

        if (value !== null) {
            return $set(['ui', 'inspector', 'valuesByNodePath', activeNodePath, propertyId], Immutable.fromJS({value, hooks}), state);
        }

        return $drop(['ui', 'inspector', 'valuesByNodePath', activeNodePath, propertyId], state);
    },

    [DISCARD]: clearReducer,
    [CLEAR]: clearReducer
});

//
// Export the selectors
//
export const selectors = {};
