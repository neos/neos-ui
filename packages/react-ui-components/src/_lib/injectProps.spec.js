import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import injectProps from './injectProps.js';

const WrappedComponent = props => <div {...props}/>;

test('should return a curried function.', t => {
    const fn = injectProps();

    t.is(typeof fn, 'function');
});
test('should return yet another curried function when calling with a React component.', t => {
    const fn = injectProps({
        foo: 'bar'
    })(WrappedComponent);

    t.is(typeof fn, 'function');
});
test('should render the wrapped React component with the initially passed props as well as any props which are specified directly on the render call.', t => {
    const Component = injectProps({
        foo: 'bar'
    })(WrappedComponent);
    const node = shallow(<Component baz="qux"/>);

    t.is(node.prop('foo'), 'bar');
    t.is(node.prop('baz'), 'qux');
});
