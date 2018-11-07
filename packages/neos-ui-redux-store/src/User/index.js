import {map} from 'ramda';
import {combineReducers} from '@neos-project/utils-redux';

import * as Settings from './Settings/index';
import * as Preferences from './Preferences/index';
import * as Name from './Name/index';

const all = {Settings, Preferences, Name};

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
export const reducer = combineReducers({
    settings: Settings.reducer,
    preferences: Preferences.reducer,
    name: Name.reducer
});

//
// Export the selectors
//
export const selectors = map(a => a.selectors, all);
