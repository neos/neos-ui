import test from 'ava';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import IconButton from './iconButton.js';

const Icon = createStubComponent();
const Button = createStubComponent();
const defaultProps = {
    IconComponent: Icon,
    ButtonComponent: Button,
    icon: 'fooIconName',
    theme: {/* eslint-disable quote-props */
        'iconButton': 'iconButtonClassName'
    }/* eslint-enable quote-props */
};
const shallow = createShallowRenderer(IconButton, defaultProps);

test('should render the "iconButton" className prop of the theme.', t => {
    const wrapper = shallow();

    t.truthy(wrapper.hasClass('iconButtonClassName'));
});
test('should render the "className" if provided.', t => {
    const wrapper = shallow({className: 'fooClassName'});

    t.truthy(wrapper.hasClass('fooClassName'));
});
test('should render the "ButtonComponent" and propagate all props to it.', t => {
    const wrapper = shallow({className: 'fooClassName'});
    const btn = wrapper.find(Button);

    t.truthy(btn.hasClass('fooClassName'));
});
test('should render the "IconComponent" and propagate the "icon" prop to it.', t => {
    const wrapper = shallow({className: 'fooClassName'});
    const icon = wrapper.find(Icon);

    t.is(icon.prop('icon'), 'fooIconName');
});
