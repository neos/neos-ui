import {
    reducer as NodesReducer,
    initialState as NodesInitialState,
    actions as Nodes
} from './Nodes/';
import {
    reducer as NodeTypesReducer,
    initialState as NodeTypesInitialState,
    actions as NodeTypes
} from './NodeTypes/';
import {
    reducer as WorkspacesReducer,
    initialState as WorkspacesInitialState,
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
// Export the initial state
//
export const initialState = {
    nodes: NodesInitialState,
    nodeTypes: NodeTypesInitialState,
    workspaces: WorkspacesInitialState
};

//
// Export the reducer
//
export const reducer = {
    ...NodesReducer,
    ...NodeTypesReducer,
    ...WorkspacesReducer
};
