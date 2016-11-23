import test from 'ava';

import node from './node';

test(`should export a function.`, t => {
    t.is(typeof (node), 'function');
});

test.todo(`Figure out a way to test propTypes`);
