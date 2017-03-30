import React from 'react';
import {createShallowRenderer} from './testUtils.js';

const WrappedComponent = props => <div {...props}/>;

test('should throw an error when called without arguments.', () => {
    const fn = () => createShallowRenderer();

    expect(fn).toThrow();
});
test('should return a curried function.', () => {
    const fn = createShallowRenderer(WrappedComponent);

    expect(typeof fn).toBe('function');
});
test('should return a instance of the shallow renderer of enzyme when calling the curried function.', () => {
    const fn = createShallowRenderer(WrappedComponent);
    const result = fn();

    expect(typeof result).toBe('object');
    expect(typeof result.find).toBe('function');
});
test('should apply the defaultProps to the to be tested React element.', () => {
    const fn = createShallowRenderer(WrappedComponent, {id: 'bar'});
    const result = fn();

    expect(result.prop('id')).toBe('bar');
});
test('should apply the props of the curried function on top of the defaultProps.', () => {
    const fn = createShallowRenderer(WrappedComponent, {id: 'bar'});
    const result = fn({id: 'baz'});

    expect(result.prop('id')).toBe('baz');
});
