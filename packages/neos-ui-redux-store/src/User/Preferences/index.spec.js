import {reducer, defaultState} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return the initial state.`, () => {
    const nextState = reducer(undefined, {
        type: 'unknown'
    });

    expect(nextState).toBe(defaultState);
});

test(`The reducer should correctly rehydrate data on INIT.`, () => {
    const initValues = {
        interfaceLanguage: 'ru'
    };
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            user: {
                preferences: initValues
            }
        }
    });

    expect(nextState).toEqual(initValues);
});
