import sinon from 'sinon';
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
    const enable = sinon.spy(debug, 'enable');

    logger.initialize('Production');
    logger.initialize('Development');

    expect(enable.calledTwice).toBe(true);
    expect(enable.calledWith('Neos*')).toBe(true);

    enable.restore();
});
