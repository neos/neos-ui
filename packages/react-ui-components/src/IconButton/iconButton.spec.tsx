import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Button from '../Button';
import Icon from '../Icon';
import IconButton, {defaultProps, IconButtonProps} from './iconButton';

describe('<IconButton/>', () => {
    const props: IconButtonProps = {
        ...defaultProps,
        className: 'fooClassName',
        icon: 'fooIconName',
        theme: {
            'iconButton': 'iconButtonClassName',
            'iconButton--disabled': 'disabledClassName',
        }
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<IconButton {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<IconButton {...props}/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should have "disabledClassName" set in "className" prop when "disabled" props is set to "true".', () => {
        const wrapper = shallow(<IconButton {...props} disabled={true}/>);

        expect(wrapper.prop('className')).toContain('disabledClassName');
    });

    it('should render the "Button" component and propagate all props to it.', () => {
        const wrapper = shallow(<IconButton {...props}/>);
        const btn = wrapper.find(Button);

        expect(btn.hasClass('fooClassName')).toBeTruthy();
    });

    it('should render the "Icon" component and propagate the "icon" prop to it.', () => {
        const wrapper = shallow(<IconButton {...props}/>);
        const icon = wrapper.find(Icon);

        expect(icon.prop('icon')).toBe('fooIconName');
    });
});
