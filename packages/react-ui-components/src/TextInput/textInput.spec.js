import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import TextInput from './textInput';

describe('<TextInput/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {}
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<TextInput {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<TextInput {...props} className="fooClassName"/>);
        const input = wrapper.find('input');

        expect(input.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<TextInput {...props} foo="bar"/>);
        const input = wrapper.find('input');

        expect(input.prop('foo')).toBe('bar');
    });

    it('should call the passed "onChange" prop with the value of the input when changing it.', () => {
        const onChange = jest.fn();
        const wrapper = shallow(<TextInput {...props} onChange={onChange}/>);
        const input = wrapper.find('input');

        input.simulate('change', {
            target: {
                value: 'my value'
            }
        });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('my value');
    });

    it('should throw no error if no "onChange" prop was passed when changing the value of the input.', () => {
        const wrapper = shallow(<TextInput {...props}/>);
        const input = wrapper.find('input');

        expect(() => {
            input.simulate('change', {
                target: {
                    value: 'my value'
                }
            });
        }).not.toThrow();
    });
});
