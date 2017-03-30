import isThenable from './isThenable';

test(`should export a function`, () => {
    expect(typeof (isThenable)).toBe('function');
});

test(`should recognize a Promise as thenable`, () => {
    expect(isThenable(Promise.resolve(false))).toBe(true);
});
