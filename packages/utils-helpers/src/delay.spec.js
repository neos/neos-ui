import test from 'ava';

import delay from './delay';

test(`should export a function`, t => {
    t.is(typeof (delay), 'function');
});

test.todo(`should resolve after given amount of time`);
