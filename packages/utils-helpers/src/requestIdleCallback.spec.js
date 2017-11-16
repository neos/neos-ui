import requestIdleCallback from './requestIdleCallback';

test(`should export a function`, () => {
    expect(typeof requestIdleCallback).toBe('function');
});
