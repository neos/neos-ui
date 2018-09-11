import regularExpressionValidator from './index';

test('"/^abc$/" should match "abc"', () => {
    const validatorOptions = {
        regularExpression: '/^abc$/'
    };

    expect(regularExpressionValidator('abc', validatorOptions)).toBe(null);
});

test('"/^abc$/" should not match "aac"', () => {
    const validatorOptions = {
        regularExpression: '/^abc$/'
    };

    expect(regularExpressionValidator('aac', validatorOptions)).not.toBe(null);
});

test('"/^abc.*$/" should match "abcaaaaa"', () => {
    const validatorOptions = {
        regularExpression: '/^abc.*$/'
    };

    expect(regularExpressionValidator('abcaaaaa', validatorOptions)).toBe(null);
});

test('"/abc/" should match "aaaabcaaa"', () => {
    const validatorOptions = {
        regularExpression: '/abc/'
    };

    expect(regularExpressionValidator('aaaabcaaa', validatorOptions)).toBe(null);
});

test('"/\\d/" should match "1"', () => {
    const validatorOptions = {
        regularExpression: '/\\d/'
    };

    expect(regularExpressionValidator('1', validatorOptions)).toBe(null);
});

test('"/\\d/" should not match "a"', () => {
    const validatorOptions = {
        regularExpression: '/\\d/'
    };

    expect(regularExpressionValidator('a', validatorOptions)).not.toBe(null);
});

test('emptyish should pass', () => {
    const validatorOptions = {
        regularExpression: '/abc/'
    };
    expect(regularExpressionValidator(null, validatorOptions)).toBe(null);
    expect(regularExpressionValidator(undefined, validatorOptions)).toBe(null);
    expect(regularExpressionValidator('', validatorOptions)).toBe(null);
});
