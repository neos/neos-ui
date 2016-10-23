import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.ADD), 'string');
    t.is(typeof (actionTypes.REMOVE), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.add), 'function');
    t.is(typeof (actions.remove), 'function');
});

test(`should export a reducer`, t => {
    t.not(reducer, undefined);
    t.is(typeof (reducer), 'function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.true(nextState.get('ui').get('flashMessages') instanceof Map);
});

test(`The "add" action should throw an error if no arguments where passed.`, t => {
    const state = new Map({});
    const fn = () => reducer(state, actions.add());

    t.throws(fn, 'Empty or non existent "id" passed to the addFlashMessage reducer. Please specify a string containing a random id.');
});

test(`The "add" action should throw an error no "message" was passed.`, t => {
    const state = new Map({});
    const fn = () => reducer(state, actions.add('myMessageId', null));

    t.throws(fn, 'Empty or non existent "message" passed to the addFlashMessage reducer. Please specify a string containing your desired message.');
});

test(`The "add" action should throw an error if an invalid "severity" was passed.`, t => {
    const state = new Map({});
    const fn = () => reducer(state, actions.add('myMessageId', 'myMessage', null));

    t.throws(fn, 'Invalid "severity" specified while adding a new FlashMessage. Allowed severities are success error info.');
});

test(`
    The "add" action should be able to add the passed data as a new flashMessage
    item.`, t => {
    const state = Immutable.fromJS({
        ui: {
            flashMessages: {}
        }
    });
    const nextState = reducer(state, actions.add('myMessageId', 'myMessage', 'error', 300));

    const addedMessage = nextState.get('ui').get('flashMessages').get('myMessageId');

    t.not(addedMessage, undefined);
    t.true(addedMessage instanceof Map);
    t.deepEqual(addedMessage.toJS(), {
        severity: 'error',
        id: 'myMessageId',
        message: 'myMessage',
        timeout: 300
    });
});

test(`
    The "add" action should normalize the severity to lowercase for the new
    flashMessage item.`, t => {
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

    t.is(addedMessage1.get('severity'), 'error');
    t.is(addedMessage2.get('severity'), 'error');
    t.is(addedMessage3.get('severity'), 'error');
});

test(`
    The "add" action should set a default timeout of "0" if none was passed for
    the new flashMessage item.`, t => {
    const state = Immutable.fromJS({
        ui: {
            flashMessages: {}
        }
    });
    const nextState = reducer(state, actions.add('myMessageId', 'myMessage', 'Error'));

    const addedMessage = nextState.get('ui').get('flashMessages').get('myMessageId');

    t.is(addedMessage.get('timeout'), 0);
});

test(`
    The "remove" action should be able to remove an added flashMessage item for
    the passed key.`, t => {
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

    t.deepEqual(nextState1.get('ui').get('flashMessages').toJS(), {
        anotherMessage: 'anotherMessage'
    });
    t.deepEqual(nextState2.get('ui').get('flashMessages').toJS(), {
        someMessage: 'someMessage'
    });
    t.deepEqual(nextState3.get('ui').get('flashMessages').toJS(), {});
});
