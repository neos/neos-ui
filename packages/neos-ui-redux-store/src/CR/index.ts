import {combineReducers} from '../combineReducers';

import * as ContentDimensions from './ContentDimensions';
import * as Nodes from './Nodes';
import * as Workspaces from './Workspaces';
import * as Publishing from './Publishing';
import * as Syncing from './Syncing';

//
// Export the subreducer state shape interface
//
export interface State {
    contentDimensions: ContentDimensions.State;
    nodes: Nodes.State;
    workspaces: Workspaces.State;
    publishing: Publishing.State;
    syncing: Syncing.State;
}

//
// Export the actionTypes
//
export const actionTypes = {
    ContentDimensions: ContentDimensions.actionTypes,
    Nodes: Nodes.actionTypes,
    Workspaces: Workspaces.actionTypes,
    Publishing: Publishing.actionTypes,
    Syncing: Syncing.actionTypes
} as const;

//
// Export the actions
//
export const actions = {
    ContentDimensions: ContentDimensions.actions,
    Nodes: Nodes.actions,
    Workspaces: Workspaces.actions,
    Publishing: Publishing.actions,
    Syncing: Syncing.actions
} as const;

//
// Export the reducer
//
export const reducer = combineReducers({
    contentDimensions: ContentDimensions.reducer,
    nodes: Nodes.reducer,
    workspaces: Workspaces.reducer,
    publishing: Publishing.reducer,
    syncing: Syncing.reducer
} as any); // TODO: when we update redux, this shouldn't be necessary https://github.com/reduxjs/redux/issues/2709#issuecomment-357328709

//
// Export the selectors
//
export const selectors = {
    ContentDimensions: ContentDimensions.selectors,
    Nodes: Nodes.selectors,
    Workspaces: Workspaces.selectors,
    Publishing: Publishing.selectors,
    Syncing: Syncing.selectors
} as const;
