import test from 'ava';

import integerValidator from './index';

test('1 should be a valid integer', t => {
    t.is(integerValidator(1), null);
});

test('"1" should be a valid integer', t => {
    t.is(integerValidator('1'), null);
});

test('-1 should be a valid integer', t => {
    t.is(integerValidator(-1), null);
});

test('"-1" should be a valid integer', t => {
    t.is(integerValidator('-1'), null);
});

test('Number.MAX_SAFE_INTEGER should be a valid integer', t => {
    t.is(integerValidator(Number.MAX_SAFE_INTEGER), null);
});

test('Number.MAX_SAFE_INTEGER + 1 should not be a valid integer', t => {
    t.not(integerValidator(Number.MAX_SAFE_INTEGER + 1, null));
});

test('Number.MIN_SAFE_INTEGER should be a valid integer', t => {
    t.is(integerValidator(Number.MIN_SAFE_INTEGER), null);
});

test('Number.MIN_SAFE_INTEGER - 1 should not be a valid integer', t => {
    t.not(integerValidator(Number.MIN_SAFE_INTEGER - 1, null));
});

test('a should not be a valid integer', t => {
    t.not(integerValidator('a'), null);
});

test('empty value should be valid', t => {
    t.is(integerValidator(''), null);
});
