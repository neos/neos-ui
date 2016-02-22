import {createAction} from 'redux-actions';
import {$get, $set} from 'plow-js';

const SET = '@packagefactory/guevara/UI/PageTree/SET';
const SET_SUB_TREE = '@packagefactory/guevara/UI/PageTree/SET_SUB_TREE';
const SET_NODE = '@packagefactory/guevara/UI/PageTree/SET_NODE';

/**
 * Set the tree data for the entire page tree
 *
 * @return {Object}
 */
const setData = createAction(SET, data => data);

/**
 * Set the tree data for a subtree
 *
 * @return {Object}
 */
const setSubTree = createAction(SET_SUB_TREE, (path, data) => ({
    path,
    data
}));

/**
 * Set a single node in the page tree
 *
 * @return {Object}
 */
const setNode = createAction(SET_NODE, (path, data) => ({
    path,
    data
}));

//
// Export the actions
//
export const actions = {
    setData,
    setSubTree,
    setNode
};

//
// Export the initial state
//
export const initialState = {};

//
// Export the reducer
//
export const reducer = {
    [SET]: treeData => $set('ui.pageTree', treeData),
    [SET_SUB_TREE]: ({path, data}) => $set(['ui', 'pageTree', path], data),
    [SET_NODE]: ({path, data}) => state => {
        const isFocused = $get('isFocused', data);
        const isActive = $get('isActive', data);

        if (!isFocused && !isActive) {
            return $set(['ui', 'pageTree', path], data, state);
        }

        return state;
    }
};
