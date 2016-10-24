import test from 'ava';
import sinon from 'sinon';

import handleActions from './handleActions';

test(`should export a function`, t => {
    t.is(typeof (handleActions), 'function');
});

test(`should return a curry function when called`, t => {
    t.is(typeof (handleActions()), 'function');
});

test(`
    should check if the passed handlers contain the given action object name and return the
    state if none was found.`, t => {
    const handler = handleActions();
    const state = {};
    const action = {
        type: 'test'
    };

    t.is(handler(state, action), state);
});

test(`
    should call the associated handler of the action type with the payload and the returned curry
    function with the state.`, t => {
    const actionReducer = sinon.spy();
    const handlers = {
        test: sinon.spy(() => actionReducer)
    };
    const handler = handleActions(handlers);
    const state = {};
    const action = {
        type: 'test',
        payload: {}
    };

    handler(state, action);

    t.true(handlers.test.calledOnce);
    t.true(handlers.test.calledWith(action.payload));

    t.true(actionReducer.calledOnce);
    t.true(actionReducer.calledWith(state));
});
