import {ActionTypes} from '../../Constants/';

export function startSaving() {
    return {
        type: ActionTypes.UI.REMOTE_SAVING_START
    };
}

export function finishSaving() {
    return {
        type: ActionTypes.UI.REMOTE_SAVING_FINISH
    };
}

export function startPublishing() {
    return {
        type: ActionTypes.UI.REMOTE_PUBLISHING_START
    };
}

export function finishPublishing() {
    return {
        type: ActionTypes.UI.REMOTE_PUBLISHING_FINISH
    };
}

export function startDiscarding() {
    return {
        type: ActionTypes.UI.REMOTE_DISCARDING_START
    };
}

export function finishDiscarding() {
    return {
        type: ActionTypes.UI.REMOTE_DISCARDING_FINISH
    };
}
