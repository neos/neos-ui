import uuidValidator from './index';

test('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa should be a valid uuid', () => {
    expect(uuidValidator('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')).toBe(null);
});

test('aaagaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa should not be a valid uuid', () => {
    expect(uuidValidator('aaagaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')).not.toBe(null);
});

test('aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa should not be a valid uuid', () => {
    expect(uuidValidator('aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa')).not.toBe(null);
});

test('aaaaaaaa-aaaa-aaaa-aaaa-aaaa should not be a valid uuid', () => {
    expect(uuidValidator('aaaaaaaa-aaaa-aaaa-aaaa-aaaa')).not.toBe(null);
});

test('aaaaaaaa-Aaaa-aaaa-aaaa-aaaaaaaaaaaa should not be a valid uuid', () => {
    expect(uuidValidator('aaaaaaaa-Aaaa-aaaa-aaaa-aaaaaaaaaaaa')).not.toBe(null);
});

test('123 should not be a valid uuid', () => {
    expect(uuidValidator('123')).not.toBe(null);
});

test('empty value should be valid', () => {
    expect(uuidValidator('')).toBe(null);
});
