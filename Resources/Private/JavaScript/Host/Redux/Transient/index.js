import {combineReducers} from 'redux';
import ChangesReducer, * as Changes from './Changes/';
import NodesReducer, * as Nodes from './Nodes/';

// Export reducers & state structure.
export default {
    transient: combineReducers({
        changes: ChangesReducer,
        nodes: NodesReducer
    })
};

// Export actions
export {
    Changes,
    Nodes
};
