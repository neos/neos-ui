import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import ShallowDropDownContents, {ShallowDropDownContentsProps} from './contents';

describe('<ShallowDropDownContents/>', () => {
    const props: ShallowDropDownContentsProps = {
        ...ShallowDropDownContents.defaultProps,
        children: 'Foo children',
        isOpen: false,
        closeDropDown: jest.fn(),
        theme: {
            'dropDown__contents': 'baseDropDownContentsClassName',
            'dropDown__contents--isOpen': 'openDropDownContentsClassName',
            'dropDown__contents--scrollable': 'scrollDropDownContentsClassName'
        },
        wrapperRef: React.createRef(),
    };

    it('should not render when having no children.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props}/>);

        expect(toJson(wrapper)).toBeFalsy();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} isOpen={true} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should render the themes "dropDown__contents--isOpen" className in case the "isOpen" prop is true.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} isOpen={true}/>);

        expect(wrapper.hasClass('openDropDownContentsClassName')).toBe(true);
    });

    it('should render a aria-hidden="false" attribute in the wrapper in case the "isOpen" prop is true.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} isOpen={true}/>);

        expect(wrapper.html().includes('aria-hidden="false"')).toBe(true);
    });

    it('should render a aria-label="dropdown" and role="button" attribute in the wrapper in case the "isOpen" prop is true.', () => {
        const wrapper = shallow(<ShallowDropDownContents {...props} isOpen={true}/>);

        expect(wrapper.html().includes('aria-label="dropdown"')).toBe(true);
    });

    it('should call the "closeDropDown" prop when clicking on the wrapper.', () => {
        const closeDropDown = jest.fn();
        const wrapper = shallow(<ShallowDropDownContents {...props} isOpen={true} closeDropDown={closeDropDown}/>);

        wrapper.simulate('click');

        expect(closeDropDown.mock.calls.length).toBe(1);
    });
});
