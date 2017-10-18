import React from 'react';
import {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import injectProps from './injectProps.js';

const WrappedComponent = props => <div {...props}/>;

test('should return a curried function.', () => {
    const fn = injectProps();

    expect(typeof fn).toBe('function');
});
test('should return yet another curried function when calling with a React component.', () => {
    const fn = injectProps({
        foo: 'bar'
    })(WrappedComponent);

    expect(typeof fn).toBe('function');
});
test('should render the wrapped React component with the initially passed props as well as any props which are specified directly on the render call.', () => {
    const Component = injectProps({
        foo: 'bar'
    })(WrappedComponent);
    const node = shallow(<Component baz="qux"/>);

    expect(node.prop('foo')).toBe('bar');
    expect(node.prop('baz')).toBe('qux');
});
