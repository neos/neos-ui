import Immutable from 'immutable';
import {$all, $set, $get} from 'plow-js';

import {actionTypes, actions, reducer, selectors} from './index.js';
import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.START_LOADING)).toBe('string');
    expect(typeof (actionTypes.FINISH_LOADING)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.startLoading)).toBe('function');
    expect(typeof (actions.finishLoading)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`should export selectors`, () => {
    expect(selectors).not.toBe(undefined);
});

test(`The reducer should create a valid initial state`, () => {
    const state = new Immutable.Map({});
    const nextState = reducer(state, {
        type: system.BOOT
    });

    expect(nextState).toMatchSnapshot();
});

test(`START_LOADING should set status to LOADING for the given image`, () => {
    const state = reducer(new Immutable.Map({}), {
        type: system.BOOT
    });
    const action = actions.startLoading('88525b30-59a6-4f97-9a79-b52172b1815b');
    const nextState = reducer(state, action);

    expect($get('cr.images.byUuid.88525b30-59a6-4f97-9a79-b52172b1815b.status', nextState))
        .toBe('LOADING');
});

test(`FINISH_LOADING should set status to LOADED for the given image`, () => {
    const state = Immutable.fromJS($all(
        $set('cr.images.byUuid.9fd46b81-5f95-4c23-8b5d-871b63b10ac9.status', 'LOADING'),
        {}
    ));
    const action = actions.finishLoading('9fd46b81-5f95-4c23-8b5d-871b63b10ac9', {});
    const nextState = reducer(state, action);

    expect($get('cr.images.byUuid.9fd46b81-5f95-4c23-8b5d-871b63b10ac9.status', nextState))
        .toBe('LOADED');
});

test(`FINISH_LOADING should loaded data for the given image`, () => {
    const state = Immutable.fromJS($all(
        $set('cr.images.byUuid.0db0937d-2ee2-4fce-a78f-17adbfdb2fbe.status', 'LOADING'),
        {}
    ));
    const action = actions.finishLoading('0db0937d-2ee2-4fce-a78f-17adbfdb2fbe', {
        some: 'value',
        another: 'different value'
    });
    const nextState = reducer(state, action);

    expect(nextState).toMatchSnapshot();
});
