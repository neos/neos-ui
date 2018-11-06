import notEmptyValidator from './index';

test('"aaa" should not be empty', () => {
    expect(notEmptyValidator('aaa')).toBe(null);
});

test('"" should be empty', () => {
    expect(notEmptyValidator('')).not.toBe(null);
});

test('[] should be empty', () => {
    expect(notEmptyValidator([])).not.toBe(null);
});

test('[1,2,3] should not be empty', () => {
    expect(notEmptyValidator([1, 2, 3])).toBe(null);
});

test('emptyish should fail', () => {
    expect(notEmptyValidator(null)).not.toBe(null);
    expect(notEmptyValidator(undefined)).not.toBe(null);
    expect(notEmptyValidator('')).not.toBe(null);
});
