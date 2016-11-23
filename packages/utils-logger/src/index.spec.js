import test from 'ava';

import logger from './index';

test(`should export logger methods`, t => {
    t.is(typeof (logger.info), 'function');
    t.is(typeof (logger.log), 'function');
    t.is(typeof (logger.error), 'function');
    t.is(typeof (logger.warning), 'function');
    t.is(typeof (logger.deprecate), 'function');
});

test(`should export initialize method`, t => {
    t.is(typeof (logger.initialize), 'function');
});
