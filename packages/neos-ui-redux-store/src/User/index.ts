import {combineReducers} from '@neos-project/neos-ui-redux-store/src/combineReducers';

import * as Settings from '@neos-project/neos-ui-redux-store/src/User/Settings';
import * as Preferences from '@neos-project/neos-ui-redux-store/src/User/Preferences';
import * as Name from '@neos-project/neos-ui-redux-store/src/User/Name';

const all = {Settings, Preferences, Name};

//
// Export the subreducer state shape interface
//
export interface State {
    settings: Settings.State;
    preferences: Preferences.State;
    name: Name.State;
}

function typedKeys<T>(o: T) : Array<keyof T> {
    return Object.keys(o) as Array<keyof T>;
}

//
// Export the actionTypes
//
export const actionTypes = typedKeys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].actionTypes}), {});

//
// Export the actions
//
export const actions = typedKeys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].actions}), {});

//
// Export the reducer
//
export const reducer = combineReducers({
    settings: Settings.reducer,
    preferences: Preferences.reducer,
    name: Name.reducer
} as any);

//
// Export the selectors
//
export const selectors = typedKeys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].selectors}), {});
