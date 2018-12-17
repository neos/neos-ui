import {map, keys} from 'ramda';
import {handleActions, combineReducers} from '@neos-project/utils-redux';

import * as Changes from './Changes/index';
import * as CR from './CR/index';
import * as System from './System/index';
import * as UI from './UI/index';
import * as User from './User/index';
import * as ServerFeedback from './ServerFeedback/index';

const all = {Changes, CR, System, UI, User, ServerFeedback};

// TODO: we'll get rid of untyped reducers soonish, this is just for transition period
const untypedReducersSubparts = {UI};
const untypedReducers = map(k => untypedReducersSubparts[k].reducer, keys(untypedReducersSubparts));

const typedReducer = combineReducers({
    cr: CR.reducer,
    system: System.reducer,
    user: User.reducer
});

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
export const reducer = handleActions([...untypedReducers, typedReducer]);

//
// Export the selectors
//
export const selectors = map(a => a.selectors, all);
