import test from 'ava';
import React from 'react';
import {createShallowRenderer} from './testUtils.js';

const WrappedComponent = props => <div {...props}/>;

test('should throw an error when called without arguments.', t => {
    const fn = () => createShallowRenderer();

    t.throws(fn);
});
test('should return a curried function.', t => {
    const fn = createShallowRenderer(WrappedComponent);

    t.is(typeof fn, 'function');
});
test('should return a instance of the shallow renderer of enzyme when calling the curried function.', t => {
    const fn = createShallowRenderer(WrappedComponent);
    const result = fn();

    t.is(typeof result, 'object');
    t.is(typeof result.find, 'function');
});
test('should apply the defaultProps to the to be tested React element.', t => {
    const fn = createShallowRenderer(WrappedComponent, {id: 'bar'});
    const result = fn();

    t.is(result.prop('id'), 'bar');
});
test('should apply the props of the curried function on top of the defaultProps.', t => {
    const fn = createShallowRenderer(WrappedComponent, {id: 'bar'});
    const result = fn({id: 'baz'});

    t.is(result.prop('id'), 'baz');
});
