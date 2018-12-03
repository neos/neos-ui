import countValidator from './index';

test('2 element object should be valid for min:0 max: 10', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(countValidator(validatorOptions, validatorOptions)).toBe(null);
});

test('2 element object should not be valid for min:3 max: 10', () => {
    const validatorOptions = {
        minimum: 3,
        maximum: 10
    };

    expect(countValidator(validatorOptions, validatorOptions)).not.toBe(null);
});

test('123 should not be valid for min:0 max: 10', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(countValidator(123, validatorOptions)).not.toBe(null);
});

test('[1, 2 3] should be valid for min:0 max: 10', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(countValidator([1, 2, 3], validatorOptions)).toBe(null);
});

test('maximum lower than minimum should return an error message', () => {
    const validatorOptions = {
        minimum: 10,
        maximum: 5
    };

    expect(countValidator([1, 2, 3], validatorOptions)).toBe('The maximum is less than the minimum.');
});

test('min -1 should be modified to 0', () => {
    const validatorOptions = {
        minimum: -1,
        maximum: 10
    };

    expect(countValidator([1, 2, 3], validatorOptions)).toBe(null);
});

test('[1, 2, 3, 4] should result in an error message for min: 1 max: 3', () => {
    const validatorOptions = {
        minimum: 1,
        maximum: 3
    };

    expect(countValidator([1, 2, 3, 4], validatorOptions)).not.toBe(null);
});

test('no element object should be valid for min:5 max: 10', () => {
    const validatorOptions = {
        minimum: 5,
        maximum: 10
    };

    expect(countValidator([], validatorOptions)).toBe(null);
});
