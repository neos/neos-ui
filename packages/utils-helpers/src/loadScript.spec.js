import test from 'ava';

import loadScript from './loadScript';

test(`should export a function`, t => {
    t.is(typeof (loadScript), 'function');
});

test.todo(`write tests`);
