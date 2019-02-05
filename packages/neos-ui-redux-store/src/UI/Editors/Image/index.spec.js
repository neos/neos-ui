import Immutable, {Map} from 'immutable';
import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.TOGGLE_IMAGE_DETAILS_SCREEN)).toBe('string');
    expect(typeof (actionTypes.UPDATE_IMAGE)).toBe('string');
    expect(typeof (actionTypes.UPLOAD_IMAGE)).toBe('string');
    expect(typeof (actionTypes.FINISH_IMAGE_UPLOAD)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.toggleImageDetailsScreen)).toBe('function');
    expect(typeof (actions.updateImage)).toBe('function');
    expect(typeof (actions.uploadImage)).toBe('function');
    expect(typeof (actions.finishImageUpload)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('ui').get('editors').get('image') instanceof Map).toBe(true);
});

test(`The "toggleImageDetailsScreen" action should set the screen identifier.`, () => {
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

    expect(
        nextState1.get('ui').get('editors').get('image').get('visibleDetailsScreen')
    ).toBe('screen-identifier');
    expect(
        nextState2.get('ui').get('editors').get('image').get('visibleDetailsScreen')
    ).toBe('screen-identifier-2');
});

test(`
    The "toggleImageDetailsScreen" action should remove the visible screen if
    called twice with the same identifier.`, () => {
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

    expect(
        nextState1.get('ui').get('editors').get('image').get('visibleDetailsScreen')
    ).toBe('screen-identifier');
    expect(
        nextState2.get('ui').get('editors').get('image').get('visibleDetailsScreen')
    ).toBe('');
});

test(`The "updateImage" action should set the transient image.`, () => {
    const image = {
        __this: 'is-an-image'
    };
    const state = new Map({});
    const nextState = reducer(state, actions.updateImage('/node/contextpath', 'abc-def-uuid', image));

    expect(nextState
        .get('ui')
        .get('inspector')
        .get('valuesByNodePath')
        .get('/node/contextpath')
        .get('images')
        .get('abc-def-uuid')).toEqual(image);
});
