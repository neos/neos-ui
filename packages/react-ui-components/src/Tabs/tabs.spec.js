import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import Tabs, {TabMenuItem} from './tabs.js';
import Panel from './panel.js';

describe('<Tabs/>', () => {
    let panelProps;
    let props;

    beforeEach(() => {
        panelProps = {
            theme: {
                panel: 'panelBaseClassName'
            }
        };
        props = {
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
            IconComponent: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Panel title="foo 1" icon="icon 1" {...panelProps}>Foo 1</Panel>
                <Panel title="foo 2" icon="icon 2" {...panelProps}>Foo 2</Panel>
                <Panel title="foo 3" icon="icon 3" {...panelProps}>Foo 3</Panel>
            </Tabs>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should initialize with a state of {activeTab: 0}.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Panel title="foo 1" icon="icon 1" {...panelProps}>Foo 1</Panel>
                <Panel title="foo 2" icon="icon 2" {...panelProps}>Foo 2</Panel>
                <Panel title="foo 3" icon="icon 3" {...panelProps}>Foo 3</Panel>
            </Tabs>
        );

        expect(wrapper.state('activeTab')).toBe(0);
    });

    it('should pass a "isActive" prop to each "TabMenuItem".', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Panel title="foo 1" icon="icon 1" {...panelProps}>Foo 1</Panel>
                <Panel title="foo 2" icon="icon 2" {...panelProps}>Foo 2</Panel>
                <Panel title="foo 3" icon="icon 3" {...panelProps}>Foo 3</Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        expect(items.at(0).prop('isActive')).toBe(true);
        expect(items.at(1).prop('isActive')).toBe(false);
        expect(items.at(2).prop('isActive')).toBe(false);
    });

    it('should pass a "onClick" prop to each "TabMenuItem" which matches the instances "handleTabNavItemClick" method.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Panel title="foo 1" icon="icon 1" {...panelProps}>Foo 1</Panel>
                <Panel title="foo 2" icon="icon 2" {...panelProps}>Foo 2</Panel>
                <Panel title="foo 3" icon="icon 3" {...panelProps}>Foo 3</Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        expect(items.at(0).prop('onClick')).toBe(wrapper.instance().handleTabNavItemClick);
    });

    it('should pass the Panels props to the "TabMenuItem" as well.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Panel title="foo 1" icon="icon 1" {...panelProps}>Foo 1</Panel>
                <Panel title="foo 2" icon="icon 2" {...panelProps}>Foo 2</Panel>
                <Panel title="foo 3" icon="icon 3" {...panelProps}>Foo 3</Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        expect(items.at(0).prop('title')).toBe('foo 1');
        expect(items.at(0).prop('icon')).toBe('icon 1');
    });

    it('should pass the static props of the "Tabs" component to the "TabMenuItem" as well.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Panel title="foo 1" icon="icon 1" {...panelProps}>Foo 1</Panel>
                <Panel title="foo 2" icon="icon 2" {...panelProps}>Foo 2</Panel>
                <Panel title="foo 3" icon="icon 3" {...panelProps}>Foo 3</Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        expect(items.at(0).prop('IconComponent')).toBe(props.IconComponent);
        expect(items.at(0).prop('theme')).toBe(props.theme);
    });

    it('should not attach the "tabNavigation__itemBtnIcon--hasLabel" className to the "TabMenuItem" if the Panels do not contain a titlte.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Panel icon="icon 1" {...panelProps}>Foo 1</Panel>
                <Panel title="foo title" icon="icon 2" {...panelProps}>Foo 2</Panel>
                <Panel icon="icon 3" {...panelProps}>Foo 3</Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        expect(
            items.at(0).html().includes(panelProps.theme['tabNavigation__itemBtnIcon--hasLabel'])
        ).toBe(false);
    });
});
