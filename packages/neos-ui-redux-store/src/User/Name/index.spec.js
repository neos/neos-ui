import {reducer, defaultState} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return the default state when called with undefined.`, () => {
    const nextState = reducer(undefined, {
        type: 'unknown'
    });

    expect(nextState).toBe(defaultState);
});

test(`The reducer should correctly rehydrate data on INIT.`, () => {
    const initValues = {
        title: '1',
        firstName: '2',
        middleName: '3',
        lastName: '4',
        otherName: '5',
        fullName: '6'
    };
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            user: {
                name: initValues
            }
        }
    });

    expect(nextState).toEqual(initValues);
});
