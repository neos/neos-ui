import {
    reducer as NodesReducer,
    actions as Nodes
} from './Nodes/';
import {
    reducer as NodeTypesReducer,
    actions as NodeTypes
} from './NodeTypes/';
import {
    reducer as WorkspacesReducer,
    actions as Workspaces
} from './Workspaces/';

//
// Export the actions
//
export const actions = {
    Nodes,
    NodeTypes,
    Workspaces
};

//
// Export the reducer
//
export const reducer = {
    ...NodesReducer,
    ...NodeTypesReducer,
    ...WorkspacesReducer
};
