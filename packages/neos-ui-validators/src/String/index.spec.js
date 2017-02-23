import test from 'ava';

import stringValidator from './index';

test('"abc" should be a valid string', t => {
    t.is(stringValidator('abc'), null);
});

test('"" should be a valid string', t => {
    t.is(stringValidator(''), null);
});

test('"123" should be a valid string', t => {
    t.is(stringValidator('123'), null);
});

test('"0123456789!@#$%^&*()_+={}[]" should be a valid string', t => {
    t.is(stringValidator('0123456789!@#$%^&*()_+={}[]'), null);
});

test('123 should not be a valid string', t => {
    t.not(stringValidator(123), null);
});

test('["123", "abc"] should not be a valid string', t => {
    t.not(stringValidator(['123', 'abc']), null);
});

test('{} should not be a valid string', t => {
    t.not(stringValidator({}), null);
});
