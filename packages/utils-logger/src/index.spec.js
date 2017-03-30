import logger from './index';

test(`should export logger methods`, () => {
    expect(typeof (logger.info)).toBe('function');
    expect(typeof (logger.log)).toBe('function');
    expect(typeof (logger.error)).toBe('function');
    expect(typeof (logger.warning)).toBe('function');
    expect(typeof (logger.deprecate)).toBe('function');
});

test(`should export initialize method`, () => {
    expect(typeof (logger.initialize)).toBe('function');
});
