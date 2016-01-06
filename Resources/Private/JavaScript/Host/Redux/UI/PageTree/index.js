import {immutableOperations} from 'Shared/Util/';

const {$set} = immutableOperations;

const SET = '@packagefactory/guevara/UI/PageTree/SET';

export default function reducer(state, action) {
    switch (action.type) {
        case SET: {
            return $set(state, 'ui.pageTree', action.data);
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
