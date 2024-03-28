import {actionTypes, actions, reducer} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.START_SAVING)).toBe('string');
    expect(typeof (actionTypes.FINISH_SAVING)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.startSaving)).toBe('function');
    expect(typeof (actions.finishSaving)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return a plain JS object as the initial state.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT
    });

    expect(typeof nextState).toBe('object');
});

test(`should initially mark the remote states as inactive.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT
    });

    expect(nextState.isSaving).toBe(false);
});

test(`The "startSaving" action should set the value of the "isSaving" key to "true"`, () => {
    const state = {
        isSaving: false
    };
    const nextState1 = reducer(state, actions.startSaving());
    const nextState2 = reducer(nextState1, actions.startSaving());

    expect(nextState1.isSaving).toBe(true);
    expect(nextState2.isSaving).toBe(true);
});

test(`The "finishSaving" action should set the value of the "isSaving" key to "false"`, () => {
    const state = {
        isSaving: true
    };
    const nextState1 = reducer(state, actions.finishSaving());
    const nextState2 = reducer(nextState1, actions.finishSaving());

    expect(nextState1.isSaving).toBe(false);
    expect(nextState2.isSaving).toBe(false);
});
