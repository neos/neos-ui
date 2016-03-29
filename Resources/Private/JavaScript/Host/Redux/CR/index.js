import {
    reducer as ImagesReducer,
    initialState as ImagesInitialState,
    actionTypes as ImagesActionTypes,
    actions as Images
} from './Images/index';
import {
    reducer as NodesReducer,
    hydrate as NodesHydrator,
    actionTypes as NodesActionTypes,
    actions as Nodes
} from './Nodes/index';
import {
    reducer as NodeTypesReducer,
    hydrate as NodeTypesHydrator,
    actions as NodeTypes
} from './NodeTypes/index';
import {
    reducer as WorkspacesReducer,
    hydrate as WorkspacesHydrator,
    actionTypes as WorkspacesActionTypes,
    actions as Workspaces
} from './Workspaces/index';

//
// Export the actionTypes
//
export const actionTypes = {
    Nodes: NodesActionTypes,
    Workspaces: WorkspacesActionTypes
};

//
// Export the actions
//
export const actions = {
    Images,
    Nodes,
    NodeTypes,
    Workspaces
};

//
// Export the initial state hydrators
//
<<<<<<< HEAD
export const hydrators = [
    NodesHydrator,
    NodeTypesHydrator,
    WorkspacesHydrator
];
=======
export const initialState = {
    images: ImagesInitialState,
    nodes: NodesInitialState,
    nodeTypes: NodeTypesInitialState,
    workspaces: WorkspacesInitialState
};
>>>>>>> WIP: load image data

//
// Export the reducer
//
export const reducer = {
    ...ImagesReducer,
    ...NodesReducer,
    ...NodeTypesReducer,
    ...WorkspacesReducer
};
