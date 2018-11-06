import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SideBar, {SideBarProps} from './sideBar';

describe('<SideBar/>', () => {
    const props: SideBarProps = {
        children: 'Foo children',
        position: 'left',
        theme: {
            'sideBar': 'sideBarClassName',
            'sideBar--left': 'leftClassName',
            'sideBar--right': 'rightClassName',
        }
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<SideBar {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<SideBar {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<SideBar {...props} aria-hidden={true}/>);
        expect(wrapper.prop('aria-hidden')).toBe(true);
    });
});
