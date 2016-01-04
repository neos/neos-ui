// Third party
import compose from 'lodash.compose';
import curry from 'lodash.curry';

const _ = curry.placeholder;

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
        curry(TransientReducer)(_, action),
        curry(UIReducer)(_, action),
        curry(UserReducer)(_, action)
    )(state);
};

// Export Actions
export const actions = {
    Transient,
    UI,
    User
};
