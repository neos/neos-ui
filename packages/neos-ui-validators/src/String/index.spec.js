import stringValidator from './index';

test('"abc" should be a valid string', () => {
    expect(stringValidator('abc')).toBe(null);
});

test('"" should be a valid string', () => {
    expect(stringValidator('')).toBe(null);
});

test('"123" should be a valid string', () => {
    expect(stringValidator('123')).toBe(null);
});

test('"0123456789!@#$%^&*()_+={}[]" should be a valid string', () => {
    expect(stringValidator('0123456789!@#$%^&*()_+={}[]')).toBe(null);
});

test('123 should not be a valid string', () => {
    expect(stringValidator(123)).not.toBe(null);
});

test('["123", "abc"] should not be a valid string', () => {
    expect(stringValidator(['123', 'abc'])).not.toBe(null);
});

test('{} should not be a valid string', () => {
    expect(stringValidator({})).not.toBe(null);
});

test('emptyish should pass', () => {
    expect(stringValidator(null)).toBe(null);
    expect(stringValidator(undefined)).toBe(null);
    expect(stringValidator('')).toBe(null);
});
