import {createShallowRenderer} from './../_lib/testUtils.js';
import Panel from './panel.js';

const defaultProps = {
    theme: {
        panel: 'panelBaseClassName'
    },
    children: 'Foo children'
};
const shallow = createShallowRenderer(Panel, defaultProps);

test('should render the themes "panel" className.', () => {
    const wrapper = shallow();

    expect(wrapper.hasClass(defaultProps.theme.panel)).toBeTruthy();
});
test('should render its provided children.', () => {
    const wrapper = shallow();

    expect(wrapper.html().includes('Foo children')).toBeTruthy();
});
test('should have a "displayName" of "Panel".', () => {
    expect(Panel.displayName).toBe('Panel');
});
