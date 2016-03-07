import {
    reducer as SettingsReducer,
    initialState as SettingsInitialState,
    actions as Settings
} from './Settings/';
import {
    reducer as NameReducer,
    initialState as NameInitialState
} from './Name/';

//
// Export the actions
//
export const actions = {
    Settings
};

//
// Export the initial state
//
export const initialState = {
    settings: SettingsInitialState,
    name: NameInitialState
};

//
// Export the reducer
//
export const reducer = {
    ...SettingsReducer,
    ...NameReducer
};
