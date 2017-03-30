import sinon from 'sinon';

import handleActions from './handleActions';

test(`should export a function`, () => {
    expect(typeof (handleActions)).toBe('function');
});

test(`should return a curry function when called`, () => {
    expect(typeof (handleActions())).toBe('function');
});

test(`
    should check if the passed handlers contain the given action object name and return the
    state if none was found.`, () => {
    const handler = handleActions();
    const state = {};
    const action = {
        type: 'test'
    };

    expect(handler(state, action)).toBe(state);
});

test(`
    should call the associated handler of the action type with the payload and the returned curry
    function with the state.`, () => {
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

    expect(handlers.test.calledOnce).toBe(true);
    expect(handlers.test.calledWith(action.payload)).toBe(true);

    expect(actionReducer.calledOnce).toBe(true);
    expect(actionReducer.calledWith(state)).toBe(true);
});
