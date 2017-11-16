import React from 'react';

/**
 * A function which returns a simple React element which can be
 * used as a test stub for cross component dependencies.
 */
export const createStubComponent = componentName => props => <div data-component-name={componentName} {...props} style={{}}/>;
