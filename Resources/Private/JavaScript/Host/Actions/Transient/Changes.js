import {ActionTypes} from '../../Constants/';

export function addChange(change) {
    return {
        type: ActionTypes.Transient.CHANGE_ADD,
        change
    };
}

export function clearChanges() {
    return {
        type: ActionTypes.Transient.CHANGES_CLEAR
    };
}
