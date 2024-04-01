import {combineReducers} from '../combineReducers';

import * as Preferences from './Preferences';
import * as Name from './Name';
import * as Impersonate from './Impersonate';

//
// Export the subreducer state shape interface
//
export interface State {
    preferences: Preferences.State;
    name: Name.State;
    impersonate: Impersonate.State;
}

//
// Export the actionTypes
//
export const actionTypes = {
    Preferences: Preferences.actionTypes,
    Name: Name.actionTypes,
    Impersonate: Impersonate.actionTypes
} as const;

//
// Export the actions
//
export const actions = {
    Preferences: Preferences.actions,
    Name: Name.actions,
    Impersonate: Impersonate.actions
} as const;

//
// Export the reducer
//
export const reducer = combineReducers({
    preferences: Preferences.reducer,
    name: Name.reducer,
    impersonate: Impersonate.reducer
} as any);

//
// Export the selectors
//
export const selectors = {
    Preferences: Preferences.selectors,
    Name: Name.selectors,
    Impersonate: Impersonate.selectors
} as const;
