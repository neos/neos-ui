import isOptionSet from './isOptionSet';

test(`Empty string should be a empty`, () => {
    expect(isOptionSet('')).toBe(true);
});

test(`Empty object should be a empty`, () => {
    expect(isOptionSet({})).toBe(true);
});

test(`Empty array should be a empty`, () => {
    expect(isOptionSet([])).toBe(true);
});

test(`Null should be a empty`, () => {
    expect(isOptionSet(null)).toBe(true);
});

test(`undefined should be a empty`, () => {
    expect(isOptionSet(undefined)).toBe(true);
});

test(`Zero should not be empty`, () => {
    expect(isOptionSet(0)).toBe(false);
});

test(`Any string should not be empty`, () => {
    expect(isOptionSet('Jon Doe')).toBe(false);
});

test(`Any object with content should not be empty`, () => {
    expect(isOptionSet({'name': 'Jon Doe'})).toBe(false);
});

test(`Any array with content should not be empty`, () => {
    expect(isOptionSet(['Jon Doe'])).toBe(false);
});
