import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import SideBar from './sideBar.js';

describe('<SideBar/>', () => {
    let props;

    beforeEach(() => {
        props = {
            position: 'left',
            children: 'Foo children',
            theme: {}
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<SideBar {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<SideBar {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<SideBar {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });
});
