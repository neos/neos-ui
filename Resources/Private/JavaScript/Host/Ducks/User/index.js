// Third party
import compose from 'lodash.compose';
import curry from 'lodash.curry';

const _ = curry.placeholder;

// Import Reducers
import SettingsReducer from './Settings/';

// Import Actions
import * as Settings from './Settings/';

// Export Reducer
export default function reducer(state, action) {
    return compose(
        curry(SettingsReducer)(_, action)
    )(state);
};

// Export Actions
export {
    Settings
};
