import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import ShallowDropDownHeader from './header.js';

describe('<ShallowDropDownHeader/>', () => {
    let props;

    beforeEach(() => {
        props = {
            children: 'Foo children',
            IconComponent: createStubComponent(),
            isOpen: false,
            toggleDropDown: () => null,
            theme: {/* eslint-disable quote-props */
                'dropDown__btn': 'baseDropDownHeaderClassName',
                'dropDown__chevron': 'baseDropDownHeaderChevronClassName'
            }/* eslint-enable quote-props */
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<ShallowDropDownHeader {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ShallowDropDownHeader {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<ShallowDropDownHeader {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should call the "toggleDropDown" prop when clicking on the wrapper.', () => {
        const toggleDropDown = jest.fn();
        const wrapper = shallow(<ShallowDropDownHeader {...props} toggleDropDown={toggleDropDown}/>);

        wrapper.simulate('click');

        expect(toggleDropDown.mock.calls.length).toBe(1);
    });

    it('should call the "_refHandler" prop with the current "isOpen" prop when rendering the node.', () => {
        const refHandler = jest.fn();
        shallow(<ShallowDropDownHeader {...props} _refHandler={refHandler} itemScope={false}/>);

        expect(refHandler.mock.calls.length).toBe(1);
        expect(refHandler.mock.calls[0][0]).toBe(false);
    });

    it('should render a node with a aria-haspopup attribute if the "isOpen" prop is falsy.', () => {
        const wrapper = shallow(<ShallowDropDownHeader {...props} isOpen={false}/>);

        expect(wrapper.html().includes('aria-haspopup')).toBeTruthy();
    });

    it('should render the passed "IconComponent" with the themes "dropDown__chevron" className and a "chevron-down" icon prop.', () => {
        const wrapper = shallow(<ShallowDropDownHeader {...props}/>);
        const icon = wrapper.find(props.IconComponent);

        expect(icon.hasClass('baseDropDownHeaderChevronClassName')).toBeTruthy();
        expect(icon.prop('icon')).toBe('chevron-down');
    });

    it('should render the passed "IconComponent" with a "chevron-up" icon prop in case the "isOpen" prop is truthy.', () => {
        const wrapper = shallow(<ShallowDropDownHeader {...props} isOpen/>);
        const icon = wrapper.find(props.IconComponent);

        expect(icon.hasClass('baseDropDownHeaderChevronClassName')).toBeTruthy();
        expect(icon.prop('icon')).toBe('chevron-up');
    });
});
