import {combineReducers} from 'redux';
import {
    reducer as SettingsReducer,
    events as SettingsEvents,
    actions as Settings
} from './Settings/';
import {
    reducer as NameReducer,
    events as NameEvents
} from './Name/';

//
// Export the actions
//
export const actions = {
    Settings
};

//
// Export the reducer
//
export const reducer = {
    user: combineReducers({
        settings: SettingsReducer,
        name: NameReducer
    })
};

//
// Export the event map
//
export const actions = {
    ...SettingsEvents,
    ...NameEvents
};
