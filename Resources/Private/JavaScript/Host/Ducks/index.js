// Third party
import compose from 'lodash.compose';

// Import Reducers
import TransientReducer from './Transient/';
import UIReducer from './UI/';
import UserReducer from './User/';

// Import Actions
import * as Transient from './Transient/';
import * as UI from './UI/';
import * as User from './User/';

// Export Reducer
export default initialState => (state = initialState, action) => {
    return compose(
        TransientReducer,
        UIReducer,
        UserReducer
    );
};

// Export Actions
export const actions = {
    Transient,
    UI,
    User
};
