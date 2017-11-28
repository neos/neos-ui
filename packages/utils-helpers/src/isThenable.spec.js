import isThenable from './isThenable';

test(`should export a function`, () => {
    expect(typeof (isThenable)).toBe('function');
});

test(`should recognize a Promise as thenable`, () => {
    expect(isThenable(Promise.resolve(false))).toBe(true);
});

test(`should recognize non-objects as not being a thenable`, () => {
    expect(isThenable('foo')).toBe(false);
    expect(isThenable(2)).toBe(false);
});

test(`should recognize objects without a "then" method as not being a thenable`, () => {
    expect(isThenable({})).toBe(false);
});
