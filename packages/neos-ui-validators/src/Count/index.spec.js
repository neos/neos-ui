import test from 'ava';

import countValidator from './index';

test('2 element object should be valid for min:0 max: 10', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.is(countValidator(validatorOptions, validatorOptions), null);
});

test('2 element object should not be valid for min:3 max: 10', t => {
    const validatorOptions = {
        minimum: 3,
        maximum: 10
    };

    t.not(countValidator(validatorOptions, validatorOptions), null);
});

test('123 should not be valid for min:0 max: 10', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.not(countValidator(123, validatorOptions), null);
});

test('[1, 2 3] should be valid for min:0 max: 10', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.is(countValidator([1, 2, 3], validatorOptions), null);
});

test('maximum lower than minimum should return an error message', t => {
    const validatorOptions = {
        minimum: 10,
        maximum: 5
    };

    t.is(countValidator([1, 2, 3], validatorOptions), 'The maximum is less than the minimum.');
});

test('min -1 should be modified to 0', t => {
    const validatorOptions = {
        minimum: -1,
        maximum: 10
    };

    t.is(countValidator([1, 2, 3], validatorOptions), null);
});

test('[1, 2, 3, 4] should result in an error message for min: 1 max: 3', t => {
    const validatorOptions = {
        minimum: 1,
        maximum: 3
    };

    t.not(countValidator([1, 2, 3, 4], validatorOptions), null);
});
