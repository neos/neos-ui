import numberRangeValidator from './index';

test('0 for min: 0 max: 10 should be valid', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(numberRangeValidator(0, validatorOptions)).toBe(null);
});

test('5 for min: 0 max: 10 should be valid', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(numberRangeValidator(5, validatorOptions)).toBe(null);
});

test('10 for min: 0 max: 10 should be valid', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(numberRangeValidator(10, validatorOptions)).toBe(null);
});

test('-1 for min: -10 max: 10 should be valid', () => {
    const validatorOptions = {
        minimum: -10,
        maximum: 10
    };

    expect(numberRangeValidator(-1, validatorOptions)).toBe(null);
});

test('11 for min: 0 max: 10 should not be valid', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(numberRangeValidator(11, validatorOptions)).not.toBe(null);
});

test('-1 for min: 0 max: 10 should not be valid', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(numberRangeValidator(-1, validatorOptions)).not.toBe(null);
});

test('empty value should be valid', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(numberRangeValidator('', validatorOptions)).toBe(null);
});

test('6 for min: 10 max: 5 should return an error message', () => {
    const validatorOptions = {
        minimum: 10,
        maximum: 5
    };

    expect(numberRangeValidator(6, validatorOptions)).toBe('The maximum is less than the minimum.');
});

test('Number.MIN_SAFE_INTEGER for min: Number.MIN_SAFE_INTEGER max: Number.MAX_SAFE_INTEGER should be valid', () => {
    const validatorOptions = {
        minimum: Number.MIN_SAFE_INTEGER,
        maximum: Number.MAX_SAFE_INTEGER
    };

    expect(numberRangeValidator(Number.MIN_SAFE_INTEGER, validatorOptions)).toBe(null);
});

test('Number.MAX_SAFE_INTEGER for min: Number.MIN_SAFE_INTEGER max: Number.MAX_SAFE_INTEGER should be valid', () => {
    const validatorOptions = {
        minimum: Number.MIN_SAFE_INTEGER,
        maximum: Number.MAX_SAFE_INTEGER
    };

    expect(numberRangeValidator(Number.MAX_SAFE_INTEGER, validatorOptions)).toBe(null);
});

test('"abc" should not be valid', () => {
    const validatorOptions = {
        minimum: Number.MIN_SAFE_INTEGER,
        maximum: Number.MAX_SAFE_INTEGER
    };

    expect(numberRangeValidator('abc', validatorOptions)).not.toBe(null);
});

test('emptyish should pass', () => {
    expect(numberRangeValidator(null)).toBe(null);
    expect(numberRangeValidator(undefined)).toBe(null);
    expect(numberRangeValidator('')).toBe(null);
});
