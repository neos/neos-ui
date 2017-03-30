import React from 'react';
import * as enzyme from 'enzyme';
import {createStubComponent} from './../_lib/testUtils.js';
import Tabs, {TabMenuItem} from './tabs.js';
import Panel from './panel.js';

const IconComponent = createStubComponent();

const defaultProps = {
    theme: {
        'tabs': 'baseTabsClassName',
        'tabs__content': 'basTabsContentsClassName',
        'tabNavigation': 'baseTabsNavigationClassName',
        'tabNavigation__item': 'baseTabsNavigationItemClassName',
        'tabNavigation__item--isActive': 'activeTabsNavigationItemClassName',
        'tabNavigation__itemBtn': 'baseTabsNavigationItemBtnClassName',
        'tabNavigation__itemBtnIcon': 'baseTabsNavigationItemBtnIconClassName',
        'tabNavigation__itemBtnIcon--hasLabel': 'baseTabsNavigationItemBtnIconWithLabelClassName'
    },
    children: 'Foo children',
    IconComponent
};
const defaultPanelProps = {
    theme: {
        panel: 'panelBaseClassName'
    }
};
const shallow = props => {
    return enzyme.shallow(
        <Tabs {...defaultProps} {...props}>
            <Panel title="foo 1" icon="icon 1" {...defaultPanelProps}>Foo 1</Panel>
            <Panel title="foo 2" icon="icon 2" {...defaultPanelProps}>Foo 2</Panel>
            <Panel title="foo 3" icon="icon 3" {...defaultPanelProps}>Foo 3</Panel>
        </Tabs>
    );
};

test('should initialize with a state of {activeTab: 0}.', () => {
    const wrapper = shallow();

    expect(wrapper.state('activeTab')).toBe(0);
});
test('should render the themes "tabs" className.', () => {
    const wrapper = shallow();

    expect(wrapper.hasClass(defaultProps.theme.tabs)).toBeTruthy();
});
test('should render a "TabMenuItem" for each passed Panel.', () => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    expect(items.length).toBe(3);
});
test('should pass a "isActive" prop to each "TabMenuItem".', () => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    expect(items.at(0).prop('isActive')).toBe(true);
    expect(items.at(1).prop('isActive')).toBe(false);
    expect(items.at(2).prop('isActive')).toBe(false);
});
test('should pass a "onClick" prop to each "TabMenuItem" which matches the instances "handleTabNavItemClick" method.', () => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    expect(items.at(0).prop('onClick')).toBe(wrapper.instance().handleTabNavItemClick);
});
test('should pass the Panels props to the "TabMenuItem" as well.', () => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    expect(items.at(0).prop('title')).toBe('foo 1');
    expect(items.at(0).prop('icon')).toBe('icon 1');
});
test('should pass the static props of the "Tabs" component to the "TabMenuItem" as well.', () => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    expect(items.at(0).prop('IconComponent')).toBe(defaultProps.IconComponent);
    expect(items.at(0).prop('theme')).toBe(defaultProps.theme);
});
test('should not attach the "tabNavigation__itemBtnIcon--hasLabel" className to the "TabMenuItem" if the Panels do not contain a titlte.', () => {
    const wrapper = enzyme.shallow(
        <Tabs {...defaultProps}>
            <Panel icon="icon 1" {...defaultPanelProps}>Foo 1</Panel>
            <Panel icon="icon 2" title="foo title" {...defaultPanelProps}>Foo 2</Panel>
            <Panel icon="icon 3" {...defaultPanelProps}>Foo 3</Panel>
        </Tabs>
    );
    const items = wrapper.find(TabMenuItem);

    expect(
        items.at(0).html().includes(defaultPanelProps.theme['tabNavigation__itemBtnIcon--hasLabel'])
    ).toBe(false);
});
test('should render each passed Panel wrapped in a div.', () => {
    const wrapper = shallow().find(`.${defaultProps.theme.tabs__content}`);
    const panels = wrapper.find(Panel);

    expect(wrapper.children().length).toBe(3);
    expect(panels.length).toBe(3);
});
test('should render a Panel wrapped in a div which is is hidden depending on the "activeTab" state.', () => {
    const wrapper = shallow().find(`.${defaultProps.theme.tabs__content}`);
    const divs = wrapper.children();

    expect(divs.at(0).html().includes('aria-hidden="false"')).toBeTruthy();
    expect(divs.at(0).html().includes('style="display:block;"')).toBeTruthy();
    expect(divs.at(1).html().includes('aria-hidden="true"')).toBeTruthy();
    expect(divs.at(1).html().includes('style="display:none;"')).toBeTruthy();
    expect(divs.at(2).html().includes('aria-hidden="true"')).toBeTruthy();
    expect(divs.at(2).html().includes('style="display:none;"')).toBeTruthy();
});
