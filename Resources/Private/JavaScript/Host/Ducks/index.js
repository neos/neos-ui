// Third party
import compose from 'lodash.compose';

// Import Reducers
import TransientReducer from './Transient/';
import UIReducer from './UI/';
import UserReducer from './User/';

// Import Actions
import actions as Transient from './Transient/';
import actions as UI from './UI/';
import actions as User from './User/';

// Export Reducer
export default function reducer(state, action) {
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
