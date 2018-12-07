import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import {DropDownWrapper, DropDownWrapperProps, defaultProps} from './wrapper';

describe('<DropDownWrapper/>', () => {
    const props: DropDownWrapperProps = {
        ...defaultProps,
        children: 'Foo children',
        theme: {
            'dropDown': 'dropDownClassName',
            'dropDown__btn': 'btnClassName',
            'dropDown--padded': 'paddedClassName',
        }
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<DropDownWrapper {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<DropDownWrapper {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should initially have a falsy "isOpen" state value.', () => {
        const wrapper = shallow(<DropDownWrapper {...props}/>);

        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('should set the "isOpen" state value to opposite when calling the toggle method.', () => {
        const wrapper = shallow(<DropDownWrapper {...props}/>);

        // @ts-ignore
        wrapper.instance().handleToggle();

        expect(wrapper.state('isOpen')).toBe(true);

        // @ts-ignore
        wrapper.instance().handleToggle();

        expect(wrapper.state('isOpen')).toBe(false);
    });
    it('should set the "isOpen" state value to false when calling the close method.', () => {
        const wrapper = shallow(<DropDownWrapper {...props}/>);

        // @ts-ignore
        wrapper.instance().handleClose();

        expect(wrapper.state('isOpen')).toBe(false);
    });
});
