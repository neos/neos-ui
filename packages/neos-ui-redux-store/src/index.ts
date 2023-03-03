import {combineReducers} from './combineReducers';

import * as Changes from './Changes';
import * as CR from './CR';
import * as System from './System';
import * as UI from './UI';
import * as User from './User';
import * as ServerFeedback from './ServerFeedback';

const all = {Changes, CR, System, UI, User, ServerFeedback};

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
    cr: CR.reducer,
    system: System.reducer,
    ui: UI.reducer,
    user: User.reducer,
    // NOTE: The plugins reducer is UNPLANNED EXTENSIBILITY, do not modify unless you know what you are doing!
    plugins: (state: System.GlobalState) => state || {}
});

//
// Export the selectors
//
export const selectors = typedKeys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].selectors}), {});
