import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import CheckBox from './checkBox.js';

describe('<CheckBox/>', () => {
    let props;

    beforeEach(() => {
        props = {
            isChecked: false,
            theme: {}
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<CheckBox {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<CheckBox {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<CheckBox {...props} foo="bar"/>);
        const input = wrapper.find('[type="checkbox"]');

        expect(input.prop('foo')).toBe('bar');
    });

    it('should throw no errors if no "onChange" prop was passed when clicking on the hidden checkbox.', () => {
        const wrapper = shallow(<CheckBox {...props}/>);
        const fn = () => wrapper.find('[type="checkbox"]').simulate('change');

        expect(fn).not.toThrow();
    });

    it('should call the passed "onChange" prop when clicking on the hidden checkbox.', () => {
        const onChange = jest.fn();
        const wrapper = shallow(<CheckBox {...props} onChange={onChange}/>);

        wrapper.find('[type="checkbox"]').simulate('change');

        expect(onChange.mock.calls.length).toBe(1);
    });

    it('should set truthy aria and checked attribute when passing a truthy "isChecked" prop.', () => {
        const wrapper = shallow(<CheckBox {...props} isChecked/>);
        const input = wrapper.find('[type="checkbox"]');

        expect(input.prop('checked')).toBe(true);
        expect(input.prop('aria-checked')).toBe(true);
    });

    it('should set falsy aria and checked attribute when passing a falsy "isChecked" prop.', () => {
        const wrapper = shallow(<CheckBox {...props} isChecked={false}/>);
        const input = wrapper.find('[type="checkbox"]');

        expect(input.prop('checked')).toBe(false);
        expect(input.prop('aria-checked')).toBe(false);
    });
});
