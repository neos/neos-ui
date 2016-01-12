import {immutableOperations} from 'Shared/Util/';

const {$get, $set} = immutableOperations;

const SET = '@packagefactory/guevara/UI/PageTree/SET';
const SET_SUB_TREE = '@packagefactory/guevara/UI/PageTree/SET_SUB_TREE';
const SET_NODE = '@packagefactory/guevara/UI/PageTree/SET_NODE';

function resetFocusAndActive(node, keepActive, keepFocus) {
    return node && node.map(page => page
          .set('isActive', keepActive ? page.get('isActive') : false)
          .set('isFocused', keepFocus ? page.get('isFocused') : false)
          .set('children', resetFocusAndActive(page.get('children'), keepActive, keepFocus)
    ));
}

export default function reducer(state, action) {
    switch (action.type) {
        case SET: {
            return $set(state, 'ui.pageTree', action.data);
        }

        case SET_SUB_TREE: {
            return $set(state, action.path, action.data);
        }

        case SET_NODE: {
            const isFocused = $get(action.data, 'isFocused');
            const isActive = $get(action.data, 'isActive');

            if (!isFocused && !isActive) {
                return $set(state, action.path, action.data);
            }

            const pageTree = $get(state, 'ui.pageTree');
            const resetState = $set(state, 'ui.pageTree', resetFocusAndActive(pageTree, !isActive, !isFocused));

            return $set(resetState, action.path, action.data);
        }

        default: return state;

    }
}

/**
 * Set the tree data for the entire page tree
 *
 * @return {Object}
 */
export function setData(data) {
    return {
        type: SET,
        data
    };
}

/**
 * Set the tree data for a subtree
 *
 * @return {Object}
 */
export function setSubTree(path, data) {
    return {
        type: SET_SUB_TREE,
        path,
        data
    };
}

/**
 * Set a single node in the page tree
 *
 * @return {Object}
 */
export function setNode(path, data) {
    return {
        type: SET_NODE,
        path,
        data
    };
}
