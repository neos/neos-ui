import {actionTypes, actions, reducer} from './index';

import {actions as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.SET)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.set)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should initialize from the init action payload.`, () => {
    const nextState = reducer(undefined, system.init({ui: {editPreviewMode: 'bar'}}));

    expect(nextState).toBe('bar');
});

test(`
    The "set" action should set the edit preview mode`, () => {
    const nextState = reducer(undefined, actions.set('baz'));

    expect(nextState).toBe('baz');
});
