import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import IconButton from './iconButton.js';

describe('<IconButton/>', () => {
    let props;

    beforeEach(() => {
        props = {
            IconComponent: createStubComponent(),
            ButtonComponent: createStubComponent(),
            icon: 'fooIconName',
            theme: {/* eslint-disable quote-props */
                'iconButton': 'iconButtonClassName'
            }/* eslint-enable quote-props */
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<IconButton {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<IconButton {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should render the "ButtonComponent" and propagate all props to it.', () => {
        const wrapper = shallow(<IconButton {...props} className="fooClassName"/>);
        const btn = wrapper.find(props.ButtonComponent);

        expect(btn.hasClass('fooClassName')).toBeTruthy();
    });

    it('should render the "IconComponent" and propagate the "icon" prop to it.', () => {
        const wrapper = shallow(<IconButton {...props} className="fooClassName"/>);
        const icon = wrapper.find(props.IconComponent);

        expect(icon.prop('icon')).toBe('fooIconName');
    });
});
