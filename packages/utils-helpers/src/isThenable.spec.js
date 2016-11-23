import test from 'ava';

import isThenable from './isThenable';

test(`should export a function`, t => {
    t.is(typeof (isThenable), 'function');
});

test(`should recognize a Promise as thenable`, t => {
    t.true(isThenable(Promise.resolve(false)));
});
