import {actionTypes, actions, subReducer as reducer} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.toggle)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return a plain JS object as the initial state.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            ui: {
                editModePanel: {}
            }
        }
    });

    expect(typeof nextState).toBe('object');
});

test(`The reducer should initially mark the editmode panel as invisible.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            ui: {
                editModePanel: {}
            }
        }
    });

    expect(nextState.isHidden).toBe(true);
});

test(`
    The "toggle" action should be able to reverse the value of the
    "isHidden" key.`, () => {
    const state = {
        isHidden: true
    };
    const nextState1 = reducer(state, actions.toggle());
    const nextState2 = reducer(nextState1, actions.toggle());

    expect(nextState1.isHidden).toBe(false);
    expect(nextState2.isHidden).toBe(true);
});
