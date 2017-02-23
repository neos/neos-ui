import test from 'ava';

import stringLengthValidator from './index';

test('"123" should be valid for min: 0 max: 10', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.is(stringLengthValidator('123', validatorOptions), null);
});

test('"123" should not be valid for min: 5 max: 10', t => {
    const validatorOptions = {
        minimum: 5,
        maximum: 10
    };

    t.not(stringLengthValidator('123', validatorOptions), null);
});

test('123 should be valid for min: 0 max: 10', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    t.is(stringLengthValidator(123, validatorOptions), null);
});

test('123 should not be valid for min: 5 max: 10', t => {
    const validatorOptions = {
        minimum: 5,
        maximum: 10
    };

    t.not(stringLengthValidator(123, validatorOptions), null);
});

test('123 should not be valid for min: 5 max: 100000', t => {
    const validatorOptions = {
        minimum: 5,
        maximum: 100000
    };

    t.not(stringLengthValidator(123, validatorOptions), null);
});

test('"abc" should return an error message for min: -1 max: 2', t => {
    const validatorOptions = {
        minimum: -1,
        maximum: 2
    };

    t.is(stringLengthValidator('abc', validatorOptions), 'The minimum StringLength can not be less than zero');
});

test('1234567890 should not be valid for min: 0 max: 5', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 5
    };

    t.not(stringLengthValidator(1234567890, validatorOptions), null);
});

test('empty value should be valid for min: 0', t => {
    const validatorOptions = {
        minimum: 0,
        maximum: 5
    };

    t.is(stringLengthValidator('', validatorOptions), null);
});

test('should return an error message if maximum < minimum', t => {
    const validatorOptions = {
        minimum: 10,
        maximum: 5
    };

    t.is(stringLengthValidator('123456', validatorOptions), 'The maximum is less than the minimum.');
});
