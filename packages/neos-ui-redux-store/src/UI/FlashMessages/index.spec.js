import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.ADD)).toBe('string');
    expect(typeof (actionTypes.REMOVE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.add)).toBe('function');
    expect(typeof (actions.remove)).toBe('function');
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

    expect(nextState.get('ui').get('flashMessages') instanceof Map).toBe(true);
});

test(`The "add" action should throw an error if no arguments where passed.`, () => {
    const state = new Map({});
    const fn = () => reducer(state, actions.add());

    expect(fn).toThrowError(
        'Empty or non existent "id" passed to the addFlashMessage reducer. Please specify a string containing a random id.'
    );
});

test(`The "add" action should throw an error no "message" was passed.`, () => {
    const state = new Map({});
    const fn = () => reducer(state, actions.add('myMessageId', null));

    expect(fn).toThrowError(
        'Empty or non existent "message" passed to the addFlashMessage reducer. Please specify a string containing your desired message.'
    );
});

test(`The "add" action should throw an error if an invalid "severity" was passed.`, () => {
    const state = new Map({});
    const fn = () => reducer(state, actions.add('myMessageId', 'myMessage', null));

    expect(fn).toThrowError(
        'Invalid "severity" specified while adding a new FlashMessage. Allowed severities are success error info.'
    );
});

test(`
    The "add" action should be able to add the passed data as a new flashMessage
    item.`, () => {
    const state = Immutable.fromJS({
        ui: {
            flashMessages: {}
        }
    });
    const nextState = reducer(state, actions.add('myMessageId', 'myMessage', 'error', 300));

    const addedMessage = nextState.get('ui').get('flashMessages').get('myMessageId');

    expect(addedMessage).not.toBe(undefined);
    expect(addedMessage instanceof Map).toBe(true);
    expect(addedMessage.toJS()).toEqual({
        severity: 'error',
        id: 'myMessageId',
        message: 'myMessage',
        timeout: 300
    });
});

test(`
    The "add" action should normalize the severity to lowercase for the new
    flashMessage item.`, () => {
    const state = Immutable.fromJS({
        ui: {
            flashMessages: {}
        }
    });
    const nextState1 = reducer(state, actions.add('myMessageId', 'myMessage', 'Error', 300));
    const nextState2 = reducer(state, actions.add('myMessageId', 'myMessage', 'ERROR', 300));
    const nextState3 = reducer(state, actions.add('myMessageId', 'myMessage', 'eRrOr', 300));

    const addedMessage1 = nextState1.get('ui').get('flashMessages').get('myMessageId');
    const addedMessage2 = nextState2.get('ui').get('flashMessages').get('myMessageId');
    const addedMessage3 = nextState3.get('ui').get('flashMessages').get('myMessageId');

    expect(addedMessage1.get('severity')).toBe('error');
    expect(addedMessage2.get('severity')).toBe('error');
    expect(addedMessage3.get('severity')).toBe('error');
});

test(`
    The "add" action should set a default timeout of "0" if none was passed for
    the new flashMessage item.`, () => {
    const state = Immutable.fromJS({
        ui: {
            flashMessages: {}
        }
    });
    const nextState = reducer(state, actions.add('myMessageId', 'myMessage', 'Error'));

    const addedMessage = nextState.get('ui').get('flashMessages').get('myMessageId');

    expect(addedMessage.get('timeout')).toBe(0);
});

test(`
    The "remove" action should be able to remove an added flashMessage item for
    the passed key.`, () => {
    const state = Immutable.fromJS({
        ui: {
            flashMessages: {
                someMessage: 'someMessage',
                anotherMessage: 'anotherMessage'
            }
        }
    });

    const nextState1 = reducer(state, actions.remove('someMessage'));
    const nextState2 = reducer(state, actions.remove('anotherMessage'));
    const nextState3 = reducer(nextState1, actions.remove('anotherMessage'));

    expect(nextState1.get('ui').get('flashMessages').toJS()).toEqual({
        anotherMessage: 'anotherMessage'
    });
    expect(nextState2.get('ui').get('flashMessages').toJS()).toEqual({
        someMessage: 'someMessage'
    });
    expect(nextState3.get('ui').get('flashMessages').toJS()).toEqual({});
});
