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

test('should render the "iconButton" className prop of the theme.', () => {
    const wrapper = shallow();

    expect(wrapper.hasClass('iconButtonClassName')).toBeTruthy();
});
test('should render the "className" if provided.', () => {
    const wrapper = shallow({className: 'fooClassName'});

    expect(wrapper.hasClass('fooClassName')).toBeTruthy();
});
test('should render the "ButtonComponent" and propagate all props to it.', () => {
    const wrapper = shallow({className: 'fooClassName'});
    const btn = wrapper.find(Button);

    expect(btn.hasClass('fooClassName')).toBeTruthy();
});
test('should render the "IconComponent" and propagate the "icon" prop to it.', () => {
    const wrapper = shallow({className: 'fooClassName'});
    const icon = wrapper.find(Icon);

    expect(icon.prop('icon')).toBe('fooIconName');
});
