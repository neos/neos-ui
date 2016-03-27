import {
    reducer as SettingsReducer,
    hydrate as SettingsHydrator,
    actions as Settings
} from './Settings/index';
import {
    reducer as NameReducer,
    hydrate as NameHydrator
} from './Name/index';

//
// Export the actions
//
export const actions = {
    Settings
};

//
// Export the initial state hydrators
//
export const hydrators = [
    SettingsHydrator,
    NameHydrator
];

//
// Export the reducer
//
export const reducer = {
    ...SettingsReducer,
    ...NameReducer
};
