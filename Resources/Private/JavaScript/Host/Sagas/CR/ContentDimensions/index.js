import {takeLatest} from 'redux-saga';
import {call, put, select} from 'redux-saga/effects';

import {actionTypes, actions} from 'Host/Redux/index';
import {publish, discard} from 'API/Endpoints/index';

import {$get} from 'plow-js';

function * updateContentCanvasSrc(action) {
    const {name, presetName} = action.payload;

    console.debug('🍅 selected preset', name, presetName);

    // Get src for node in selected dimension
    const activeDimensions = yield select($get('cr.contentDimensions.active'));

    console.debug('🌠 active dimensions', activeDimensions.toJS());
}

function * watchSelectPreset() {
    yield * takeLatest(actionTypes.CR.ContentDimensions.SELECT_PRESET, updateContentCanvasSrc);
}

export const sagas = [
    watchSelectPreset
];
