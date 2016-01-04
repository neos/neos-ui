// Third party
import compose from 'lodash.compose';

// Import Reducers
import ChangesReducer from './Changes/';
import NodesReducer from './Nodes/';

// Import Actions
import * as Changes from './Changes/';
import * as Nodes from './Nodes/';

// Export Reducer
export default function reducer(state, action) {
    return compose(
        ChangesReducer,
        NodesReducer
    );
};

// Export Actions
export const actions = {
    Changes,
    Nodes
};
