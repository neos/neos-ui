import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.START_SAVING)).toBe('string');
    expect(typeof (actionTypes.FINISH_SAVING)).toBe('string');
    expect(typeof (actionTypes.START_PUBLISHING)).toBe('string');
    expect(typeof (actionTypes.FINISH_PUBLISHING)).toBe('string');
    expect(typeof (actionTypes.START_DISCARDING)).toBe('string');
    expect(typeof (actionTypes.FINISH_DISCARDING)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.startSaving)).toBe('function');
    expect(typeof (actions.finishSaving)).toBe('function');
    expect(typeof (actions.startPublishing)).toBe('function');
    expect(typeof (actions.finishPublishing)).toBe('function');
    expect(typeof (actions.startDiscarding)).toBe('function');
    expect(typeof (actions.finishDiscarding)).toBe('function');
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

    expect(nextState.get('ui').get('remote') instanceof Map).toBe(true);
});

test(`should initially mark the remote states as inactive.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('ui').get('remote').get('isSaving')).toBe(false);
    expect(nextState.get('ui').get('remote').get('isPublishing')).toBe(false);
    expect(nextState.get('ui').get('remote').get('isDiscarding')).toBe(false);
});

test(`The "startSaving" action should set the value of the "isSaving" key to "true"`, () => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isSaving: false
            }
        }
    });
    const nextState1 = reducer(state, actions.startSaving());
    const nextState2 = reducer(nextState1, actions.startSaving());

    expect(nextState1.get('ui').get('remote').get('isSaving')).toBe(true);
    expect(nextState2.get('ui').get('remote').get('isSaving')).toBe(true);
});

test(`The "finishSaving" action should set the value of the "isSaving" key to "false"`, () => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isSaving: true
            }
        }
    });
    const nextState1 = reducer(state, actions.finishSaving());
    const nextState2 = reducer(nextState1, actions.finishSaving());

    expect(nextState1.get('ui').get('remote').get('isSaving')).toBe(false);
    expect(nextState2.get('ui').get('remote').get('isSaving')).toBe(false);
});

test(`The "startPublishing" action should set the value of the "isPublishing" key to "true"`, () => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isPublishing: false
            }
        }
    });
    const nextState1 = reducer(state, actions.startPublishing());
    const nextState2 = reducer(nextState1, actions.startPublishing());

    expect(nextState1.get('ui').get('remote').get('isPublishing')).toBe(true);
    expect(nextState2.get('ui').get('remote').get('isPublishing')).toBe(true);
});

test(`The "finishPublishing" action should set the value of the "isPublishing" key to "false"`, () => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isPublishing: true
            }
        }
    });
    const nextState1 = reducer(state, actions.finishPublishing());
    const nextState2 = reducer(nextState1, actions.finishPublishing());

    expect(nextState1.get('ui').get('remote').get('isPublishing')).toBe(false);
    expect(nextState2.get('ui').get('remote').get('isPublishing')).toBe(false);
});

test(`The "startDiscarding" action should set the value of the "isDiscarding" key to "true"`, () => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isDiscarding: false
            }
        }
    });
    const nextState1 = reducer(state, actions.startDiscarding());
    const nextState2 = reducer(nextState1, actions.startDiscarding());

    expect(nextState1.get('ui').get('remote').get('isDiscarding')).toBe(true);
    expect(nextState2.get('ui').get('remote').get('isDiscarding')).toBe(true);
});

test(`The "finishDiscarding" action should set the value of the "isDiscarding" key to "false"`, () => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isDiscarding: true
            }
        }
    });
    const nextState1 = reducer(state, actions.finishDiscarding());
    const nextState2 = reducer(nextState1, actions.finishDiscarding());

    expect(nextState1.get('ui').get('remote').get('isDiscarding')).toBe(false);
    expect(nextState2.get('ui').get('remote').get('isDiscarding')).toBe(false);
});
