import React from 'react';
import {shallow} from 'enzyme';

const err = msg => {
    throw new Error(msg);
};
const NO_COMPONENT = 'Please specify a valid Reac.component constructor in the createRenderer call.';

/**
 * The createShallowRenderer function is used to write less repetitive
 * tests setup.
 *
 * @param  {React.Element} A valid React constructor to be rendered as JSX.
 * @return {Object} The shallow rendered output of `enzyme`,
 */
export const createShallowRenderer = (Component = err(NO_COMPONENT), defaultProps = {}) => {
    return (props = {}, context) => shallow(<Component {...defaultProps} {...props}/>, {context});
};

/**
 * A function which returns a simple React element which can be
 * used as a test stub for cross component dependencies.
 */
export const createStubComponent = componentName => props => <div data-component-name={componentName} {...props} style={{}}/>;
