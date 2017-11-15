import debug from 'debug';
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

test(`should export call the debug.enable method when executing the initialize function.`, () => {
    // ToDo: Move the mock setup in beforeEach/afterEach once we switch to the `describe` style of writing test suites.
    const enable = jest.spyOn(debug, 'enable').mockImplementation(jest.fn());

    logger.initialize('Production');
    logger.initialize('Development');

    expect(enable.mock.calls.length).toBe(2);
    expect(enable.mock.calls[0]).toEqual(['Neos*']);

    enable.mockRestore();
});
