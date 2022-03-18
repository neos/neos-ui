import isNil from './isNil';

test(`Empty string should not be a empty`, () => {
    expect(isNil('')).toBe(false);
});

test(`Empty object should not be a empty`, () => {
    expect(isNil({})).toBe(false);
});

test(`Empty array should not be a nil`, () => {
    expect(isNil([])).toBe(false);
});

test(`Null should be a nil`, () => {
    expect(isNil(null)).toBe(true);
});

test(`undefined should be a nil`, () => {
    expect(isNil(undefined)).toBe(true);
});

test(`Zero should not be nil`, () => {
    expect(isNil(0)).toBe(false);
});

test(`Any string should not be nil`, () => {
    expect(isNil('Jon Doe')).toBe(false);
});

test(`Any object with content should not be nil`, () => {
    expect(isNil({'name': 'Jon Doe'})).toBe(false);
});

test(`Any array with content should not be nil`, () => {
    expect(isNil(['Jon Doe'])).toBe(false);
});
