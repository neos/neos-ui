import test from 'ava';

import alohaConfiguration from './alohaConfiguration';


test(`should export a function.`, t => {
    t.is(typeof (alohaConfiguration), 'function');
});

test.todo(`Figure out a way to test propTypes`);
