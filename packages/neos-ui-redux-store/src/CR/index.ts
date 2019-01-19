import {keys} from 'ramda';

import {combineReducers} from 'redux';


import * as ContentDimensions from '@neos-project/neos-ui-redux-store/src/CR/ContentDimensions';
import * as Nodes from '@neos-project/neos-ui-redux-store/src/CR/Nodes';
import * as Workspaces from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';

const all = {ContentDimensions, Nodes, Workspaces};

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
export const actionTypes = keys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].actionTypes}), {});

//
// Export the actions
//
export const actions = keys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].actions}), {});

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
export const selectors = keys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].selectors}), {});
