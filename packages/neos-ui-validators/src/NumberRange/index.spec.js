import test from 'ava';

import numberRangeValidator from './index';

test('0 for min: 0 max: 10 should be valid', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.is(numberRangeValidator(0, validatorOptions), null);
});

test('5 for min: 0 max: 10 should be valid', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.is(numberRangeValidator(5, validatorOptions), null);
});

test('10 for min: 0 max: 10 should be valid', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.is(numberRangeValidator(10, validatorOptions), null);
});

test('-1 for min: -10 max: 10 should be valid', t => {
    const validatorOptions = {
        minimum: -10,
        maximum: 10
    };

    t.is(numberRangeValidator(-1, validatorOptions), null);
});

test('11 for min: 0 max: 10 should not be valid', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.not(numberRangeValidator(11, validatorOptions), null);
});

test('-1 for min: 0 max: 10 should not be valid', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.not(numberRangeValidator(-1, validatorOptions), null);
});

test('empty value should be valid', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.is(numberRangeValidator('', validatorOptions), null);
});

test('6 for min: 10 max: 5 should return an error message', t => {
    const validatorOptions = {
        minimum: 10,
        maximum: 5
    };

    t.is(numberRangeValidator(6, validatorOptions), 'The maximum is less than the minimum.');
});

test('Number.MIN_SAFE_INTEGER for min: Number.MIN_SAFE_INTEGER max: Number.MAX_SAFE_INTEGER should be valid', t => {
    const validatorOptions = {
        minimum: Number.MIN_SAFE_INTEGER,
        maximum: Number.MAX_SAFE_INTEGER
    };

    t.is(numberRangeValidator(Number.MIN_SAFE_INTEGER, validatorOptions), null);
});

test('Number.MAX_SAFE_INTEGER for min: Number.MIN_SAFE_INTEGER max: Number.MAX_SAFE_INTEGER should be valid', t => {
    const validatorOptions = {
        minimum: Number.MIN_SAFE_INTEGER,
        maximum: Number.MAX_SAFE_INTEGER
    };

    t.is(numberRangeValidator(Number.MAX_SAFE_INTEGER, validatorOptions), null);
});

test('"abc" should not be valid', t => {
    const validatorOptions = {
        minimum: Number.MIN_SAFE_INTEGER,
        maximum: Number.MAX_SAFE_INTEGER
    };

    t.not(numberRangeValidator('abc', validatorOptions), null);
});
