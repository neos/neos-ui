import {map, keys} from 'ramda';

import {handleActions} from '@neos-project/utils-redux';

import * as ContentDimensions from './ContentDimensions/index';
import * as Images from './Images/index';
import * as Nodes from './Nodes/index';
import * as Workspaces from './Workspaces/index';

const all = {ContentDimensions, Images, Nodes, Workspaces};

//
// Export the actionTypes
//
export const actionTypes = map(a => a.actionTypes, all);

//
// Export the actions
//
export const actions = map(a => a.actions, all);

//
// Export the reducer
//
export const reducer = handleActions(map(k => all[k].reducer, keys(all)));

//
// Export the selectors
//
export const selectors = map(a => a.selectors, all);
