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
