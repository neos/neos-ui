import test from 'ava';

import discover from './discover';

test(`should export a function`, t => {
    t.is(typeof (discover), 'function');
});

test.todo(`write tests`);
