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

test('emptyish should pass', () => {
    expect(integerValidator(null)).toBe(null);
    expect(integerValidator(undefined)).toBe(null);
    expect(integerValidator('')).toBe(null);
});

test('Number with trailing chars should not be a valid integer', () => {
    expect(integerValidator('1a')).not.toBe(null);
});

test('Number with leading chars should not be a valid integer', () => {
    expect(integerValidator('a1')).not.toBe(null);
});

test('Number with chars inside should not be a valid integer', () => {
    expect(integerValidator('1a1')).not.toBe(null);
});
