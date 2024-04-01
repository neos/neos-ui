import {combineReducers} from '../combineReducers';

import * as ContentDimensions from './ContentDimensions';
import * as Nodes from './Nodes';
import * as Workspaces from './Workspaces';

//
// Export the subreducer state shape interface
//
export interface State {
    contentDimensions: ContentDimensions.State;
    nodes: Nodes.State;
    workspaces: Workspaces.State;
}

//
// Export the actionTypes
//
export const actionTypes = {
    ContentDimensions: ContentDimensions.actionTypes,
    Nodes: Nodes.actionTypes,
    Workspaces: Workspaces.actionTypes
} as const;

//
// Export the actions
//
export const actions = {
    ContentDimensions: ContentDimensions.actions,
    Nodes: Nodes.actions,
    Workspaces: Workspaces.actions
} as const;

//
// Export the reducer
//
export const reducer = combineReducers({
    contentDimensions: ContentDimensions.reducer,
    nodes: Nodes.reducer,
    workspaces: Workspaces.reducer
} as any); // TODO: when we update redux, this shouldn't be necessary https://github.com/reduxjs/redux/issues/2709#issuecomment-357328709

//
// Export the selectors
//
export const selectors = {
    ContentDimensions: ContentDimensions.selectors,
    Nodes: Nodes.selectors,
    Workspaces: Workspaces.selectors
} as const;
