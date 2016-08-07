import test from 'ava';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Panel from './panel.js';

const defaultProps = {
    theme: {
        panel: 'panelBaseClassName'
    },
    children: 'Foo children'
};
const shallow = createShallowRenderer(Panel, defaultProps);

test('should render the themes "panel" className.', t => {
    const wrapper = shallow();

    t.truthy(wrapper.hasClass(defaultProps.theme.panel));
});
test('should render its provided children.', t => {
    const wrapper = shallow();

    t.truthy(wrapper.html().includes('Foo children'));
});
test('should have a "displayName" of "Panel".', t => {
    t.is(Panel.displayName, 'Panel');
});
