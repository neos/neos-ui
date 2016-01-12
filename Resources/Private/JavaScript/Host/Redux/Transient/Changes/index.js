import Immutable from 'immutable';
import {createAction, handleActions} from 'redux-actions';

const ADD = '@packagefactory/guevara/Transient/Changes/ADD';
const CLEAR = '@packagefactory/guevara/Transient/Changes/CLEAR';

export default handleActions({
    [ADD]: (state, action) => state.set('changes', state.get('changes').push(action.payload.change)),
    [CLEAR]: state => state.set('changes', Immutable.fromJS([]))
});

/**
 * Adds the given chagnge to the global state.
 * If you want to add a change, use the the ChangeManager API.
 */
export const add = createAction(ADD, change => ({change}));

/**
 * Clears all local changes from the global state.
 * If you want to flush the changes, use the ChangeManager API.
 */
export const clear = createAction(CLEAR);
