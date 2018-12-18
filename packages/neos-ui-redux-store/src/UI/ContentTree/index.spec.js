import {actionTypes, actions, reducer} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
    expect(typeof (actionTypes.RELOAD_TREE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.toggle)).toBe('function');
    expect(typeof (actions.reloadTree)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return an plain js object as the initial state.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT
    });

    expect(typeof nextState).toBe('object');
});
