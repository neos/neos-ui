// Third party
import compose from 'lodash.compose';
import curry from 'lodash.curry';

const _ = curry.placeholder;

// Import Reducers
import ChangesReducer from './Changes/';
import NodesReducer from './Nodes/';

// Import Actions
import * as Changes from './Changes/';
import * as Nodes from './Nodes/';

// Export Reducer
export default function reducer(state, action) {
    return compose(
        curry(ChangesReducer)(_, action),
        curry(NodesReducer)(_, action)
    )(state);
}

// Export Actions
export {
    Changes,
    Nodes
};
