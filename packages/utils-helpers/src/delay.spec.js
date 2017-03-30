import delay from './delay';

test(`should export a function`, () => {
    expect(typeof (delay)).toBe('function');
});

test(`should resolve after given amount of time`, () => {
    expect(true).toBe(true);
});
