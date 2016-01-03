import {ActionTypes} from '../../Constants/';

/**
 * Adds the given chagnge to the global state.
 * If you want to add a change, use the the ChangeManager API.
 *
 * @param {Object} change The changeset to add.
 */
export function addChange(change) {
    return {
        type: ActionTypes.Transient.CHANGE_ADD,
        change
    };
}

/**
 * Clears all local changes from the global state.
 * If you want to flush the changes, use the ChangeManager API.
 */
export function clearChanges() {
    return {
        type: ActionTypes.Transient.CHANGES_CLEAR
    };
}
