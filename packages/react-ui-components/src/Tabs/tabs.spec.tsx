import React from 'react';
import {shallow, mount} from 'enzyme';
import toJson from 'enzyme-to-json';
import Tabs, {TabMenuItem, TabsProps, tabsDefaultProps} from './tabs';
import {PanelProps} from './panel';

// todo find a better way to make font-awesome work ;)
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
library.add(fab, fas, far);

describe('<Tabs/>', () => {
    const panelProps: PanelProps = {
        children: [<div key={'foo'}>'Foo children'</div>],
        theme: {
            panel: 'panelBaseClassName'
        }
    };

    const props: TabsProps = {
        ...tabsDefaultProps,
        theme: {
            'tabs': 'baseTabsClassName',
            'tabs__content': 'baseTabsContentsClassName',
            'tabs__panel': 'baseTabsPanelsClassName',
            'tabNavigation': 'baseTabsNavigationClassName',
            'tabNavigation__item': 'baseTabsNavigationItemClassName',
            'tabNavigation__item--isActive': 'activeTabsNavigationItemClassName',
            'tabNavigation__itemBtn': 'baseTabsNavigationItemBtnClassName',
            'tabNavigation__itemBtnIcon': 'baseTabsNavigationItemBtnIconClassName',
            'tabNavigation__itemBtnIcon--hasLabel': 'baseTabsNavigationItemBtnIconWithLabelClassName'
        },
        children: [<div key={'foo'}>'Foo children'</div>]
    };

    it('should use the activeTab prop when initializing.', () => {
        const wrapper = shallow(
            <Tabs {...props} activeTab={2}>
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );

        expect(wrapper.state('activeTab')).toBe(2);
    });

    it('should update the state when a tab menu item is clicked.', () => {
        const wrapper = mount(
            <Tabs {...props}>
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );

        const tabMenuItems = wrapper.find(TabMenuItem);

        const buttonOfFirstTabMenuItem = tabMenuItems.at(2).find('button').at(0);

        buttonOfFirstTabMenuItem.simulate('click');

        expect(wrapper.state('activeTab')).toBe(2);
    });

    it('should trigger the hook, when a tab menu item is clicked.', () => {
        const onActiveTabChange = jest.fn();

        const wrapper = mount(
            <Tabs {...props} onActiveTabChange={onActiveTabChange}>
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );

        const tabMenuItems = wrapper.find(TabMenuItem);

        const buttonOfFirstTabMenuItem = tabMenuItems.at(2).find('button').at(0);

        buttonOfFirstTabMenuItem.simulate('click');

        expect(onActiveTabChange).toHaveBeenCalledTimes(1);
        expect(onActiveTabChange).toBeCalledWith(2);
    });

    it('activeTab as string: should use the activeTab prop when initializing.', () => {
        const wrapper = shallow(
            <Tabs {...props} activeTab="zwei">
                <Tabs.Panel {...panelProps} id="eins" title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} id="zwei" title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} id="drei" title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );
        expect(wrapper.state('activeTab')).toBe('zwei');
    });

    it('activeTab as string: should update the state & trigger the hook when a tab menu item is clicked.', () => {
        const onActiveTabChange = jest.fn();

        const wrapper = mount(
            <Tabs {...props} onActiveTabChange={onActiveTabChange}>
                <Tabs.Panel {...panelProps} id="eins" title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} id="zwei" title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} id="drei" title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );

        const tabMenuItems = wrapper.find(TabMenuItem);

        const buttonOfFirstTabMenuItem = tabMenuItems.at(2).find('button').at(0);

        buttonOfFirstTabMenuItem.simulate('click');

        expect(wrapper.state('activeTab')).toBe('drei');
        expect(onActiveTabChange).toHaveBeenCalledTimes(1);
        expect(onActiveTabChange).toBeCalledWith('drei');
    });

    it('should render correctly.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should initialize with a state of {activeTab: 0}.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );

        expect(wrapper.state('activeTab')).toBe(0);
    });

    it('should pass a "isActive" prop to each "TabMenuItem".', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
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
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        // @ts-ignore
        expect(items.at(0).prop('onClick')).toBe(wrapper.instance().handleTabNavItemClick);
    });

    it('should pass the Panels props to the "TabMenuItem" as well.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        expect(items.at(0).prop('title')).toBe('foo 1');
        expect(items.at(0).prop('icon')).toBe('level-up');
    });

    it('should pass the static props of the "Tabs" component to the "TabMenuItem" as well.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Tabs.Panel {...panelProps} title="foo 1" icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 2" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo 3" icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        expect(items.at(0).prop('theme')).toBe(props.theme);
    });

    it('should not attach the "tabNavigation__itemBtnIcon--hasLabel" className to the "TabMenuItem" if the Panels do not contain a titlte.', () => {
        const wrapper = shallow(
            <Tabs {...props}>
                <Tabs.Panel {...panelProps} icon="level-up">Foo 1</Tabs.Panel>
                <Tabs.Panel {...panelProps} title="foo title" icon="level-down">Foo 2</Tabs.Panel>
                <Tabs.Panel {...panelProps} icon="mobile">Foo 3</Tabs.Panel>
            </Tabs>
        );
        const items = wrapper.find(TabMenuItem);

        expect(items.at(0).html().includes(props.theme!['tabNavigation__itemBtnIcon--hasLabel'])).toBe(false);
        expect(items.at(1).html().includes(props.theme!['tabNavigation__itemBtnIcon--hasLabel'])).toBe(true);
        expect(items.at(2).html().includes(props.theme!['tabNavigation__itemBtnIcon--hasLabel'])).toBe(false);
    });
});
