import {combineReducers} from './combineReducers';

import * as Changes from './Changes';
import * as CR from './CR';
import * as System from './System';
import * as UI from './UI';
import * as User from './User';
import * as ServerFeedback from './ServerFeedback';

//
// Export the actionTypes
//
export const actionTypes = {
    Changes: Changes.actionTypes,
    CR: CR.actionTypes,
    System: System.actionTypes,
    UI: UI.actionTypes,
    User: User.actionTypes,
    ServerFeedback: ServerFeedback.actionTypes
} as const;

//
// Export the actions
//
export const actions = {
    Changes: Changes.actions,
    CR: CR.actions,
    System: System.actions,
    UI: UI.actions,
    User: User.actions,
    ServerFeedback: ServerFeedback.actions
} as const;

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
export const selectors = {
    Changes: Changes.selectors,
    CR: CR.selectors,
    System: System.selectors,
    UI: UI.selectors,
    User: User.selectors,
    ServerFeedback: ServerFeedback.selectors
} as const;
