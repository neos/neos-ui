// Third party
import compose from 'lodash.compose';

// Import Reducers
import SettingsReducer from './Settings/';

// Import Actions
import * as Settings from './Settings/';

// Export Reducer
export default function reducer(state, action) {
    return compose(
        SettingsReducer
    );
};

// Export Actions
export const actions = {
    Settings
};
