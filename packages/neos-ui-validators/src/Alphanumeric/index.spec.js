import alphanumericValidator from './index';

test('"a1b2" should be alphanumeric', () => {
    expect(alphanumericValidator('a1b2')).toBe(null);
});

test('"ÄÖÜß" should be alphanumeric', () => {
    expect(alphanumericValidator('ÄÖÜß')).toBe(null);
});

test('"!ÄÖÜß" should not be alphanumeric', () => {
    expect(alphanumericValidator('!ÄÖÜß')).not.toBe(null);
});

test('"--" should not be alphanumeric', () => {
    expect(alphanumericValidator('--')).not.toBe(null);
});

test('"ab c" should not be alphanumeric', () => {
    expect(alphanumericValidator('ab c')).not.toBe(null);
});

test('emptyish should pass', () => {
    expect(alphanumericValidator(null)).toBe(null);
    expect(alphanumericValidator(undefined)).toBe(null);
    expect(alphanumericValidator('')).toBe(null);
});
