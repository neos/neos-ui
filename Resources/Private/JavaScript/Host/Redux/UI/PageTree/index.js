import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const SET = '@packagefactory/guevara/UI/PageTree/SET';
const SET_SUB_TREE = '@packagefactory/guevara/UI/PageTree/SET_SUB_TREE';
const SET_NODE = '@packagefactory/guevara/UI/PageTree/SET_NODE';
const initialState = Immutable.fromJS({});

function resetFocusAndActive(node, keepActive, keepFocus) {
    return node && node.map(page => page
          .set('isActive', keepActive ? page.get('isActive') : false)
          .set('isFocused', keepFocus ? page.get('isFocused') : false)
          .set('children', resetFocusAndActive(page.get('children'), keepActive, keepFocus)
    ));
}

export default handleActions({
    [SET]: (state, action) => Immutable.fromJS(action.payload),
    [SET_SUB_TREE]: (state, action) => $set(state, action.payload.path, action.payload.data),
    [SET_NODE]: (state, action) => {
        const {data, path} = action.payload;
        const isFocused = $get(data, 'isFocused');
        const isActive = $get(data, 'isActive');

        if (!isFocused && !isActive) {
            return $set(state, path, data);
        }

        const resetState = $set(state, null, resetFocusAndActive(state, !isActive, !isFocused));

        return $set(resetState, path, data);
    }
}, initialState);

/**
 * Set the tree data for the entire page tree
 *
 * @return {Object}
 */
export const setData = createAction(SET, data => data);

/**
 * Set the tree data for a subtree
 *
 * @return {Object}
 */
export const setSubTree = createAction(SET_SUB_TREE, (path, data) => ({
    path,
    data
}));

/**
 * Set a single node in the page tree
 *
 * @return {Object}
 */
export const setNode = createAction(SET_NODE, (path, data) => ({
    path,
    data
}));
