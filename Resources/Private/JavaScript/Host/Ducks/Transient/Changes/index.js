import Immutable from 'immutable';

const ADD = '@packagefactory/guevara/Transient/Changes/ADD';
const CLEAR = '@packagefactory/guevara/Transient/Changes/CLEAR';

export default function reducer(state, action) {
    switch (action.type) {
        case ADD:
            return state.set('changes', state.get('changes').push(action.change));

        case CLEAR:
            return state.set('changes', Immutable.fromJS([]));

        default: return state;
    }
}

/**
 * Adds the given chagnge to the global state.
 * If you want to add a change, use the the ChangeManager API.
 *
 * @param {Object} change The changeset to add.
 */
export function add(change) {
    return {
        type: ADD,
        change
    };
}

/**
 * Clears all local changes from the global state.
 * If you want to flush the changes, use the ChangeManager API.
 */
export function clear() {
    return {
        type: CLEAR
    };
}
