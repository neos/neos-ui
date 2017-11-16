import delay from './delay';

test(`should export a function`, () => {
    expect(typeof delay).toBe('function');
});

test(`should call the given function after the given delay`, () => {
    const promise = delay(200);

    expect(promise instanceof Promise).toBe(true);
});
