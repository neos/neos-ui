import test from 'ava';

import {info, log, error, warning, deprecate, initialize} from './index';

test(`should export logger methods`, t => {
    t.is(typeof (info), 'function');
    t.is(typeof (log), 'function');
    t.is(typeof (error), 'function');
    t.is(typeof (warning), 'function');
    t.is(typeof (deprecate), 'function');
});

test(`should export initialize method`, t => {
    t.is(typeof (initialize), 'function');
});
