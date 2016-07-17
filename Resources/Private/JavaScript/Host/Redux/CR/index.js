import {map, keys} from 'ramda';

import {handleActions} from 'Shared/Utilities/index';

import * as Images from './Images/index';
import * as Nodes from './Nodes/index';
import * as NodeTypes from './NodeTypes/index';
import * as Workspaces from './Workspaces/index';

const all = {Images, Nodes, NodeTypes, Workspaces};

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
