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
    Nodes,
    NodeTypes,
    Workspaces
};

//
// Export the initial state hydrators
//
export const hydrators = [
    NodesHydrator,
    NodeTypesHydrator,
    WorkspacesHydrator
];

//
// Export the reducer
//
export const reducer = {
    ...NodesReducer,
    ...NodeTypesReducer,
    ...WorkspacesReducer
};
