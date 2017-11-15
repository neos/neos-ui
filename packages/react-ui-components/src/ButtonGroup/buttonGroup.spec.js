import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import ButtonGroup from './buttonGroup.js';

describe('<ButtonGroup/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                btnGroup: 'cleanClassName'
            },
            value: 'foo',
            onSelect: jest.fn(),
            children: [
                <div key="foo" id="foo">Foo button</div>,
                <div key="bar" id="bar">Bar button</div>
            ]
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<ButtonGroup {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ButtonGroup {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<ButtonGroup {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });
});
