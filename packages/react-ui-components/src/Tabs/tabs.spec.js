import test from 'ava';
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

test('should initialize with a state of {activeTab: 0}.', t => {
    const wrapper = shallow();

    t.is(wrapper.state('activeTab'), 0);
});
test('should render the themes "tabs" className.', t => {
    const wrapper = shallow();

    t.truthy(wrapper.hasClass(defaultProps.theme.tabs));
});
test('should render a "TabMenuItem" for each passed Panel.', t => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    t.is(items.length, 3);
});
test('should pass a "isActive" prop to each "TabMenuItem".', t => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    t.is(items.at(0).prop('isActive'), true);
    t.is(items.at(1).prop('isActive'), false);
    t.is(items.at(2).prop('isActive'), false);
});
test('should pass a "onClick" prop to each "TabMenuItem" which matches the instances "handleTabNavItemClick" method.', t => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    t.is(items.at(0).prop('onClick'), wrapper.instance().handleTabNavItemClick);
});
test('should pass the Panels props to the "TabMenuItem" as well.', t => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    t.is(items.at(0).prop('title'), 'foo 1');
    t.is(items.at(0).prop('icon'), 'icon 1');
});
test('should pass the static props of the "Tabs" component to the "TabMenuItem" as well.', t => {
    const wrapper = shallow();
    const items = wrapper.find(TabMenuItem);

    t.is(items.at(0).prop('IconComponent'), defaultProps.IconComponent);
    t.is(items.at(0).prop('theme'), defaultProps.theme);
});
test('should not attach the "tabNavigation__itemBtnIcon--hasLabel" className to the "TabMenuItem" if the Panels do not contain a titlte.', t => {
    const wrapper = enzyme.shallow(
        <Tabs {...defaultProps}>
            <Panel icon="icon 1" {...defaultPanelProps}>Foo 1</Panel>
            <Panel icon="icon 2" title="foo title" {...defaultPanelProps}>Foo 2</Panel>
            <Panel icon="icon 3" {...defaultPanelProps}>Foo 3</Panel>
        </Tabs>
    );
    const items = wrapper.find(TabMenuItem);

    t.is(items.at(0).html().includes(defaultPanelProps.theme['tabNavigation__itemBtnIcon--hasLabel']), false);
});
test('should render each passed Panel wrapped in a div.', t => {
    const wrapper = shallow().find(`.${defaultProps.theme.tabs__content}`);
    const panels = wrapper.find(Panel);

    t.is(wrapper.children().length, 3);
    t.is(panels.length, 3);
});
test('should render a Panel wrapped in a div which is is hidden depending on the "activeTab" state.', t => {
    const wrapper = shallow().find(`.${defaultProps.theme.tabs__content}`);
    const divs = wrapper.children();

    t.truthy(divs.at(0).html().includes('aria-hidden="false"'));
    t.truthy(divs.at(0).html().includes('style="display:block;"'));
    t.truthy(divs.at(1).html().includes('aria-hidden="true"'));
    t.truthy(divs.at(1).html().includes('style="display:none;"'));
    t.truthy(divs.at(2).html().includes('aria-hidden="true"'));
    t.truthy(divs.at(2).html().includes('style="display:none;"'));
});
