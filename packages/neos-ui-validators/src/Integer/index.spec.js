import integerValidator from './index';

test('1 should be a valid integer', () => {
    expect(integerValidator(1)).toBe(null);
});

test('"1" should be a valid integer', () => {
    expect(integerValidator('1')).toBe(null);
});

test('-1 should be a valid integer', () => {
    expect(integerValidator(-1)).toBe(null);
});

test('"-1" should be a valid integer', () => {
    expect(integerValidator('-1')).toBe(null);
});

test('Number.MAX_SAFE_INTEGER should be a valid integer', () => {
    expect(integerValidator(Number.MAX_SAFE_INTEGER)).toBe(null);
});

test('Number.MAX_SAFE_INTEGER + 1 should not be a valid integer', () => {
    expect(integerValidator(Number.MAX_SAFE_INTEGER + 1)).not.toBe(null);
});

test('Number.MIN_SAFE_INTEGER should be a valid integer', () => {
    expect(integerValidator(Number.MIN_SAFE_INTEGER)).toBe(null);
});

test('Number.MIN_SAFE_INTEGER - 1 should not be a valid integer', () => {
    expect(integerValidator(Number.MIN_SAFE_INTEGER - 1)).not.toBe(null);
});

test('a should not be a valid integer', () => {
    expect(integerValidator('a')).not.toBe(null);
});

test('empty value should be valid', () => {
    expect(integerValidator('')).toBe(null);
});
