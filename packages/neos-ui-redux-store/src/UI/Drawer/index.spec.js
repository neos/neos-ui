import {actionTypes as system} from '../../System/index';

import {actionTypes, actions, reducer} from './index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
    expect(typeof (actionTypes.HIDE)).toBe('string');
    expect(typeof (actionTypes.TOGGLE_MENU_GROUP)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.toggle)).toBe('function');
    expect(typeof (actions.hide)).toBe('function');
    expect(typeof (actions.toggleMenuGroup)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return a plain js object as the initial state.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            ui: {
                drawer: {}
            }
        }
    });

    expect(typeof nextState).toBe('object');
});

test(`The "toggle" action should be able to reverse the value of the "isHidden" key.`, () => {
    const state = {
        isHidden: true
    };
    const nextState1 = reducer(state, actions.toggle());
    const nextState2 = reducer(nextState1, actions.toggle());

    expect(nextState1.isHidden).toBe(false);
    expect(nextState2.isHidden).toBe(true);
});

test(`The "hide" action should set the "isHidden" key to "true".`, () => {
    const state = {
        isHidden: false
    };
    const nextState1 = reducer(state, actions.hide());
    const nextState2 = reducer(nextState1, actions.hide());

    expect(nextState1.isHidden).toBe(true);
    expect(nextState2.isHidden).toBe(true);
});

test(`The reducer should initially mark the menu group "content" as collapsed.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            ui: {
                drawer: {}
            }
        }
    });

    expect(nextState.collapsedMenuGroups.includes('content')).toBe(true);
});

test(`The "toggleMenuGroup" action should add or remove given group from "collapsedMenuGroups".`, () => {
    const state = {
        collapsedMenuGroups: []
    };
    const nextState1 = reducer(state, actions.toggleMenuGroup('content'));
    const nextState2 = reducer(nextState1, actions.toggleMenuGroup('management'));
    const nextState3 = reducer(nextState2, actions.toggleMenuGroup('content'));
    const nextState4 = reducer(nextState3, actions.toggleMenuGroup('management'));

    expect(nextState1.collapsedMenuGroups.includes('content')).toBe(true);
    expect(nextState2.collapsedMenuGroups.includes('content')).toBe(true);
    expect(nextState2.collapsedMenuGroups.includes('management')).toBe(true);
    expect(nextState3.collapsedMenuGroups.includes('content')).toBe(false);
    expect(nextState3.collapsedMenuGroups.includes('management')).toBe(true);
    expect(nextState4.collapsedMenuGroups.includes('content')).toBe(false);
    expect(nextState4.collapsedMenuGroups.includes('management')).toBe(false);
});
