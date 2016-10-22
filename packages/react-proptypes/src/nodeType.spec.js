import test from 'ava';

import nodeType from './nodeType';


test(`should export a function.`, t => {
    t.is(typeof (nodeType), 'function');
});

test.todo(`Figure out a way to test propTypes`);
