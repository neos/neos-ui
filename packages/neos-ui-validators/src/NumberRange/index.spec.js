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
