import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import ShallowDropDownContents from './contents.js';

describe('<ShallowDropDownContents/>', () => {
    let props;

    beforeEach(() => {
        props = {
            children: 'Foo children',
            isOpen: false,
            closeDropDown: () => null,
            theme: {
                'dropDown__contents': 'baseDropDownContentsClassName',
                'dropDown__contents--isOpen': 'openDropDownContentsClassName'
            }
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should render the themes "dropDown__contents--isOpen" className in case the "isOpen" prop is truthy.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} isOpen/>);

        expect(wrapper.hasClass('openDropDownContentsClassName')).toBeTruthy();
    });

    it('should render a aria-hidden="false" attribute in the wrapper in case the "isOpen" prop is truthy.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} isOpen/>);

        expect(wrapper.html().includes('aria-hidden="false"')).toBeTruthy();
    });

    it('should render a aria-label="dropdown" and role="button" attribute in the wrapper in case the "isOpen" prop is truthy.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} isOpen/>);

        expect(wrapper.html().includes('aria-label="dropdown"')).toBeTruthy();
    });

    it('should call the "closeDropDown" prop when clicking on the wrapper.', () => {
        const closeDropDown = jest.fn();
        const wrapper = shallow(<ShallowDropDownContents {...props} closeDropDown={closeDropDown}/>);

        wrapper.simulate('click');

        expect(closeDropDown.mock.calls.length).toBe(1);
    });
});
