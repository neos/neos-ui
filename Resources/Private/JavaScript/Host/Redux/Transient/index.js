import {combineReducers} from 'redux';
import {
    reducer as ChangesReducer,
    actions as Changes
} from './Changes/';
import {
    reducer as NodesReducer,
    actions as Nodes
} from './Nodes/';
import {
    reducer as NodeTypesReducer,
    actions as NodeTypes
} from './NodeTypes/';

//
// Export the actions
//
export const actions = {
    Changes,
    Nodes,
    NodeTypes
};

//
// Export the reducer
//
export const reducer = {
    transient: combineReducers({
        changes: ChangesReducer,
        nodes: NodesReducer,
        nodeTypes: NodeTypesReducer
    })
};
