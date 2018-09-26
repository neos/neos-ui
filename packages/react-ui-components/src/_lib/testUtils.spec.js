import React from 'react';
import PropTypes from 'prop-types';
import {createStubComponent} from './testUtils';

describe('createStubComponent()', () => {
    it('should be a function', () => {
        expect(typeof createStubComponent).toBe('function');
    });

    it('should return curry function that returns a React Node when called', () => {
        const Component = createStubComponent('My foo component');

        expect(typeof Component).toBe('function');
        expect(() => PropTypes.checkPropTypes({
            node: PropTypes.node.isRequired
        }, {
            node: <Component foo="bar"/>
        }, 'node', 'MyComponent')).not.toThrow();
    });
});
