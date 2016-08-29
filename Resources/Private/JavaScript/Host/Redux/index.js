import {map, keys} from 'ramda';
import {handleActions} from 'Shared/Utilities/index';

import * as Changes from './Changes/index';
import * as CR from './CR/index';
import * as System from './System/index';
import * as UI from './UI/index';
import * as User from './User/index';
import * as Guest from './Guest/index';

const all = {Changes, CR, System, UI, User, Guest};

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
