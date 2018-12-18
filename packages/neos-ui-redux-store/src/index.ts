import {keys} from 'ramda';
import {combineReducers} from 'redux';

import * as Changes from '@neos-project/neos-ui-redux-store/src/Changes';
import * as CR from '@neos-project/neos-ui-redux-store/src/CR';
import * as System from '@neos-project/neos-ui-redux-store/src/System';
import * as UI from '@neos-project/neos-ui-redux-store/src/UI';
import * as User from '@neos-project/neos-ui-redux-store/src/User';
import * as ServerFeedback from '@neos-project/neos-ui-redux-store/src/ServerFeedback';

const all = {Changes, CR, System, UI, User, ServerFeedback};

//
// Export the actionTypes
//
export const actionTypes = keys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].actionTypes}), {});

//
// Export the actions
//
export const actions = keys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].actions}), {});

//
// Export the reducer
//
export const reducer = combineReducers({
    cr: CR.reducer,
    system: System.reducer,
    ui: UI.reducer,
    user: User.reducer
});

//
// Export the selectors
//
export const selectors = keys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].selectors}), {});
