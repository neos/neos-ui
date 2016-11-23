import test from 'ava';

import documentNode from './documentNode';

test(`should export a function.`, t => {
    t.is(typeof (documentNode), 'function');
});

test.todo(`Figure out a way to test propTypes`);
