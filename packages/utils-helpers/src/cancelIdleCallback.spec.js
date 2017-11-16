import cancelIdleCallback, {getCancelIdleCallback, fallbackCancelIdleCallback} from './cancelIdleCallback';

test(`should export a function`, () => {
    expect(typeof cancelIdleCallback).toBe('function');
});

test(`should export a getCancelIdleCallback function that returns the "cancelIdleCallback" property of a fallback function`, () => {
    expect(getCancelIdleCallback({cancelIdleCallback: 'foo'})).toBe('foo');
    expect(getCancelIdleCallback()).toBe(fallbackCancelIdleCallback);
});
