import test from 'ava';
import Immutable, {Map} from 'immutable';
import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.TOGGLE_IMAGE_DETAILS_SCREEN), 'string');
    t.is(typeof (actionTypes.UPDATE_IMAGE), 'string');
    t.is(typeof (actionTypes.UPLOAD_IMAGE), 'string');
    t.is(typeof (actionTypes.FINISH_IMAGE_UPLOAD), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.toggleImageDetailsScreen), 'function');
    t.is(typeof (actions.updateImage), 'function');
    t.is(typeof (actions.uploadImage), 'function');
    t.is(typeof (actions.finishImageUpload), 'function');
});

test(`should export a reducer`, t => {
    t.not(reducer, undefined);
    t.is(typeof (reducer), 'function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.true(nextState.get('ui').get('editors').get('image') instanceof Map);
});

test(`The "toggleImageDetailsScreen" action should set the screen identifier.`, t => {
    const state = Immutable.fromJS({
        ui: {
            editors: {
                image: {
                    visibleDetailsScreen: ''
                }
            }
        }
    });
    const nextState1 = reducer(state, actions.toggleImageDetailsScreen('screen-identifier'));
    const nextState2 = reducer(nextState1, actions.toggleImageDetailsScreen('screen-identifier-2'));

    t.is(nextState1.get('ui').get('editors').get('image').get('visibleDetailsScreen'), 'screen-identifier');
    t.is(nextState2.get('ui').get('editors').get('image').get('visibleDetailsScreen'), 'screen-identifier-2');
});

test(`
    The "toggleImageDetailsScreen" action should remove the visible screen if
    called twice with the same identifier.`, t => {
    const state = Immutable.fromJS({
        ui: {
            editors: {
                image: {
                    visibleDetailsScreen: ''
                }
            }
        }
    });
    const nextState1 = reducer(state, actions.toggleImageDetailsScreen('screen-identifier'));
    const nextState2 = reducer(nextState1, actions.toggleImageDetailsScreen('screen-identifier'));

    t.is(nextState1.get('ui').get('editors').get('image').get('visibleDetailsScreen'), 'screen-identifier');
    t.is(nextState2.get('ui').get('editors').get('image').get('visibleDetailsScreen'), '');
});

test(`The "updateImage" action should set the transient image.`, t => {
    const image = {
        __this: 'is-an-image'
    };
    const state = new Map({});
    const nextState = reducer(state, actions.updateImage('/node/contextpath', 'abc-def-uuid', image));

    t.deepEqual(
        nextState
            .get('ui')
            .get('inspector')
            .get('valuesByNodePath')
            .get('/node/contextpath')
            .get('images')
            .get('abc-def-uuid'),
        image
    );
});
