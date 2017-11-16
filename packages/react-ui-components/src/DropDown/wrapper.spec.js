import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {DropDownWrapper} from './wrapper.js';

describe('<DropDownWrapper/>', () => {
    let props;

    beforeEach(() => {
        props = {
            children: 'Foo children',
            theme: {}
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<DropDownWrapper {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<DropDownWrapper {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<DropDownWrapper {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should initially have a falsy "isOpen" state value.', () => {
        const wrapper = shallow(<DropDownWrapper {...props}/>);

        expect(wrapper.state('isOpen')).toBeFalsy();
    });

    it('should set the "isOpen" state value to opposite when calling the toggle method.', () => {
        const wrapper = shallow(<DropDownWrapper {...props}/>);

        wrapper.instance().handleToggle();

        expect(wrapper.state('isOpen')).toBeTruthy();

        wrapper.instance().handleToggle();

        expect(wrapper.state('isOpen')).toBeFalsy();
    });
    it('should set the "isOpen" state value to false when calling the close method.', () => {
        const wrapper = shallow(<DropDownWrapper {...props}/>);

        wrapper.instance().handleClose();

        expect(wrapper.state('isOpen')).toBeFalsy();
    });
});
