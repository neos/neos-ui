import {combineReducers} from 'redux';
import {
    reducer as ChangesReducer,
    actions as Changes
} from './Changes/';
import {
    reducer as NodesReducer,
    actions as Nodes
} from './Nodes/';

//
// Export the actions
//
export const actions = {
    Changes,
    Nodes
};

//
// Export the reducer
//
export const reducer = {
    transient: combineReducers({
        changes: ChangesReducer,
        nodes: NodesReducer
    })
};
