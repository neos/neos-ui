import {combineReducers} from 'redux';
import SettingsReducer, * as Settings from './Settings/';
import NameReducer from './Name/';

// Export reducers & state structure.
export default {
    user: combineReducers({
        settings: SettingsReducer,
        name: NameReducer
    })
};

// Export all actions
export {
    Settings
};
