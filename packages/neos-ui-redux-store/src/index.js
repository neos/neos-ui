import {map, keys} from 'ramda';
import {handleActions} from '@neos-project/utils-redux';

import * as Changes from './Changes/index';
import * as CR from './CR/index';
import * as System from './System/index';
import * as UI from './UI/index';
import * as User from './User/index';
import * as ServerFeedback from './ServerFeedback/index';
import {$set, $get} from 'plow-js';

const all = {Changes, CR, System, UI, User, ServerFeedback};

// TODO: we'll get rid of untyped reducers soonish, this is just for transition period
const untypedReducersSubparts = {Changes, CR, UI, User, ServerFeedback};
const untypedReducers = map(k => untypedReducersSubparts[k].reducer, keys(untypedReducersSubparts));

// We do something similar to `combineReducers` from redux here to pass a subpart of the state to a child reducer
// Key in this object is the substate path, and the value is the reducer
const typedReducersSubparts = {
    system: System.reducer
};
const typedReducers = map(
    k => (state, action) => $set(
        k,
        typedReducersSubparts[k]($get(k, state), action),
        state
    ),
    keys(typedReducersSubparts)
);

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
export const reducer = handleActions([...untypedReducers, ...typedReducers]);

//
// Export the selectors
//
export const selectors = map(a => a.selectors, all);
