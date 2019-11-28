import stringLengthValidator from './index';

test('"123" should be valid for min: 0 max: 10', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(stringLengthValidator('123', validatorOptions)).toBe(null);
});

test('"123" should not be valid for min: 5 max: 10', () => {
    const validatorOptions = {
        minimum: 5,
        maximum: 10
    };

    expect(stringLengthValidator('123', validatorOptions)).not.toBe(null);
});

test('123 should be valid for min: 0 max: 10', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 10
    };

    expect(stringLengthValidator(123, validatorOptions)).toBe(null);
});

test('123 should not be valid for min: 5 max: 10', () => {
    const validatorOptions = {
        minimum: 5,
        maximum: 10
    };

    expect(stringLengthValidator(123, validatorOptions)).not.toBe(null);
});

test('123 should not be valid for min: 5 max: 100000', () => {
    const validatorOptions = {
        minimum: 5,
        maximum: 100000
    };

    expect(stringLengthValidator(123, validatorOptions)).not.toBe(null);
});

test('"abc" should return an error message for min: -1 max: 2', () => {
    const validatorOptions = {
        minimum: -1,
        maximum: 2
    };

    expect(stringLengthValidator('abc', validatorOptions)).toBe('The minimum StringLength can not be less than zero');
});

test('1234567890 should not be valid for min: 0 max: 5', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 5
    };

    expect(stringLengthValidator(1234567890, validatorOptions)).not.toBe(null);
});

test('empty value should be valid for min: 0', () => {
    const validatorOptions = {
        minimum: 0,
        maximum: 5
    };

    expect(stringLengthValidator('', validatorOptions)).toBe(null);
});

test('empty value should be valid for min: 5 max: 10', () => {
    const validatorOptions = {
        minimum: 5,
        maximum: 10
    };

    expect(stringLengthValidator('', validatorOptions)).toBe(null);
});

test('should return an error message if maximum < minimum', () => {
    const validatorOptions = {
        minimum: 10,
        maximum: 5
    };

    expect(stringLengthValidator('123456', validatorOptions)).toBe('The maximum is less than the minimum.');
});

test('"abc <br />" should return an error message for max: 5 and not ignore the html', () => {
    const validatorOptions = {
        maximum: 5,
        ignoreHtml: false
    };

    expect(stringLengthValidator('abc <br />', validatorOptions)).not.toBe(null);
});

test('"abc <br />" should be valid for max: 5 and ignore the html', () => {
    const validatorOptions = {
        maximum: 5,
        ignoreHtml: true
    };

    expect(stringLengthValidator('abc <br />', validatorOptions)).toBe(null);
});

test('"abc <br />" should be valid for min:5 and max: 10 and ignore the html', () => {
    const validatorOptions = {
        minimum: 5,
        maximum: 10,
        ignoreHtml: true
    };

    expect(stringLengthValidator('abcd <br />', validatorOptions)).toBe(null);
});
