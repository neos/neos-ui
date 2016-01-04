import {immutableOperations} from '../../../Shared/Util/';

const {$set} = immutableOperations;

const START_SAVING = '@packagefactory/guevara/UI/Remote/START_SAVING':
const FINISH_SAVING = '@packagefactory/guevara/UI/Remote/FINISH_SAVING':
const START_PUBLISHING = '@packagefactory/guevara/UI/Remote/START_PUBLISHING':
const FINISH_PUBLISHING = '@packagefactory/guevara/UI/Remote/FINISH_PUBLISHING':
const START_DISCARDING = '@packagefactory/guevara/UI/Remote/START_DISCARDING':
const FINISH_DISCARDING = '@packagefactory/guevara/UI/Remote/FINISH_DISCARDING':

export default function reducer (state, action) {
    switch(action.type) {

        case START_SAVING:
            return $set(state, 'ui.remote.isSaving', true);

        case FINISH_SAVING:
            return $set(state, 'ui.remote.isSaving', false);

        case START_PUBLISHING:
            return $set(state, 'ui.remote.isPublishing', true);

        case FINISH_PUBLISHING:
            return $set(state, 'ui.remote.isPublishing', false);

        case START_DISCARDING:
            return $set(state, 'ui.remote.isDiscarding', true);

        case FINISH_DISCARDING:
            return $set(state, 'ui.remote.isDiscarding', false);

        default: return state;

    }
}

/**
 * Marks an ongoing saving process
 *
 * @return {Object}
 */
export function startSaving() {
    return {
        type: START_SAVING
    };
}

/**
 * Marks that an ongoing saving process has finished
 *
 * @return {Object}
 */
export function finishSaving() {
    return {
        type: FINISH_SAVING
    };
}

/**
 * Marks an ongoing publishing process
 *
 * @return {Object}
 */
export function startPublishing() {
    return {
        type: START_PUBLISHING
    };
}

/**
 * Marks that an ongoing publishing process has finished
 *
 * @return {Object}
 */
export function finishPublishing() {
    return {
        type: FINISH_PUBLISHING
    };
}

/**
 * Marks an ongoing discarding process
 *
 * @return {Object}
 */
export function startDiscarding() {
    return {
        type: START_DISCARDING
    };
}

/**
 * Marks that an ongoing discarding process has finished
 *
 * @return {Object}
 */
export function finishDiscarding() {
    return {
        type: FINISH_DISCARDING
    };
}
