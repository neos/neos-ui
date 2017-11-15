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

    expect(handler(state, action)).toMatchSnapshot();
});

test(`
    should call the associated handler of the action type with the payload and the returned curry
    function with the state.`, () => {
    const actionReducer = jest.fn(state => ({...state, foo: 2}));
    const handlers = {
        test: jest.fn(() => actionReducer)
    };
    const handler = handleActions(handlers);
    const state = {foo: 0};
    const action = {
        type: 'test',
        payload: {}
    };

    const newState = handler(state, action);

    expect(handlers.test.mock.calls.length).toBe(1);
    expect(handlers.test.mock.calls[0]).toEqual([action.payload]);

    expect(actionReducer.mock.calls.length).toBe(1);
    expect(actionReducer.mock.calls[0]).toEqual([state]);
    expect(newState).toMatchSnapshot();
});

test(`should call the all handlers payload and the state if a list was provided as the first argument.`, () => {
    const handlers = [jest.fn(state => ({...state, foo: 2})), jest.fn(state => ({...state, bar: 3}))];
    const handler = handleActions(handlers);
    const state = {baz: 1};
    const action = {
        type: 'test',
        payload: {}
    };
    const newState = handler(state, action);

    expect(handlers[0].mock.calls.length).toBe(1);
    expect(handlers[1].mock.calls.length).toBe(1);
    expect(newState).toMatchSnapshot();
});
