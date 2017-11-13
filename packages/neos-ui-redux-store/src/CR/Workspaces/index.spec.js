import Immutable from 'immutable';
import {$all, $set, $get} from 'plow-js';

import {actionTypes, actions, reducer, selectors} from './index.js';
import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.UPDATE)).toBe('string');
    expect(typeof (actionTypes.PUBLISH)).toBe('string');
    expect(typeof (actionTypes.DISCARD)).toBe('string');
    expect(typeof (actionTypes.CHANGE_BASE_WORKSPACE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.update)).toBe('function');
    expect(typeof (actions.publish)).toBe('function');
    expect(typeof (actions.discard)).toBe('function');
    expect(typeof (actions.changeBaseWorkspace)).toBe('function');
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
        type: system.INIT,
        payload: $set('cr.workspaces.personalWorkspace', {initial: 'workspace-data'}, {})
    });

    expect(nextState).toMatchSnapshot();
});

test(`UPDATE should set personal workspace data to given data`, () => {
    const state = reducer(new Immutable.Map({}), {
        type: system.INIT,
        payload: $set('cr.workspaces.personalWorkspace', {initial: 'workspace-data'}, {})
    });
    const action = actions.update({totally: 'different-workspace-data'});
    const nextState = reducer(state, action);

    expect(nextState).toMatchSnapshot();
});
