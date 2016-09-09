import {takeLatest} from 'redux-saga';
import {select} from 'redux-saga/effects';

import {actionTypes} from 'Host/Redux/index';

import {$get} from 'plow-js';

function * updateContentCanvasSrc(action) {
    const {name, presetName} = action.payload;

    console.debug('🍅 selected preset', name, presetName);

    const activeDimensions = yield select($get('cr.contentDimensions.active'));

    console.debug('🌠 active dimensions', activeDimensions.toJS());

    // TODO Get src for current node in active dimension
}

function * watchSelectPreset() {
    // It is okay to cancel previous preset selections
    yield * takeLatest(actionTypes.CR.ContentDimensions.SELECT_PRESET, updateContentCanvasSrc);
}

export const sagas = [
    watchSelectPreset
];
