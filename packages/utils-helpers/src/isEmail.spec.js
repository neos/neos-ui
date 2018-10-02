import isEmail from './isEmail';

test(`hello@neos.io should be a valid email`, () => {
    expect(isEmail('hello@neos.io')).toBe(true);
});

test(`hello@neos shouldn't be a valid email`, () => {
    expect(isEmail('hello@neos')).toBe(false);
});

test(`an empty string shouldn't be a valid email`, () => {
    expect(isEmail('')).toBe(false);
});

test(`an integer should throw a TypeError`, () => {
    expect(() => isEmail(1)).toThrow(TypeError);
});

test(`null should throw a TypeError`, () => {
    expect(() => isEmail(null)).toThrow(TypeError);
});

test(`undefined should throw a TypeError`, () => {
    expect(() => isEmail(undefined)).toThrow(TypeError);
});

test(`an array should throw a TypeError`, () => {
    expect(() => isEmail([])).toThrow(TypeError);
});

test(`an object should throw a TypeError`, () => {
    expect(() => isEmail({})).toThrow(TypeError);
});
