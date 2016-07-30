import {JSX} from 'jsx-test-helpers';

const err = (msg) => {
    throw new Error(msg);
};
const NO_JSX_FACTORY = 'Please pass a function as a first argument which returns some JSX fixture.';

/**
 * The fixtureFactory is a small wrapper to create JSX fixtures for
 * reacts `ShallowRenderer` feature. The generated fixture can be used
 * within tests to compare the actual against the expected(fixture) markup.
 *
 * @param  {Function} The JSX factory which gets called with a merged props object which then can be spreaded on the fixture element.
 * @return {String} The shallow rendered markup.
 */
export const fixtureFactory = (jsxFactory = err(NO_JSX_FACTORY), internalDefaultProps = {}) => (props = {}) => {
    return JSX( // eslint-disable-line new-cap
        jsxFactory(Object.assign({}, internalDefaultProps, props))
    );
};
