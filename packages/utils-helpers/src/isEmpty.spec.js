import isEmpty from './isEmpty';

test(`Empty string should be a empty`, () => {
    expect(isEmpty('')).toBe(true);
});

test(`Empty object should be a empty`, () => {
    expect(isEmpty({})).toBe(true);
});

test(`Empty array should be a empty`, () => {
    expect(isEmpty([])).toBe(true);
});

test(`Null should be a empty`, () => {
    expect(isEmpty(null)).toBe(true);
});

test(`undefined should be a empty`, () => {
    expect(isEmpty(undefined)).toBe(true);
});

test(`Zero should not be empty`, () => {
    expect(isEmpty(0)).toBe(false);
});

test(`Any string should not be empty`, () => {
    expect(isEmpty('Jon Doe')).toBe(false);
});

test(`Any object with content should not be empty`, () => {
    expect(isEmpty({'name': 'Jon Doe'})).toBe(false);
});

test(`Any array with content should not be empty`, () => {
    expect(isEmpty(['Jon Doe'])).toBe(false);
});
