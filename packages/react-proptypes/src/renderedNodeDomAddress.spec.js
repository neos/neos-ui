import test from 'ava';

import renderedNodeDomAddress from './renderedNodeDomAddress';

test(`should export a function.`, t => {
    t.is(typeof (renderedNodeDomAddress), 'function');
});

test.todo(`Figure out a way to test propTypes`);
