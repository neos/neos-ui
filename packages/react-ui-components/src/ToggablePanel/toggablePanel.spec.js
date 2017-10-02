import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import Enzyme, {render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import ToggablePanel, {
    StatelessToggablePanel,
    Header,
    Contents
} from './toggablePanel.js';

Enzyme.configure({adapter: new Adapter()});

const defaultThemeProps = {
    theme: {
        'panel': 'baseClassName',
        'panel--isOpen': 'isOpenClassName',
        'panel__headline': 'panelHeadlineClassName',
        'panel__contents': 'panelContentsClassName'
    }
};

const defaultProps = {
    ...defaultThemeProps,
    children: 'Foo children'
};
const shallow = createShallowRenderer(ToggablePanel, defaultProps);

const stateLessDefaultProps = {
    theme: {
        'panel': 'baseClassName',
        'panel--isOpen': 'isOpenClassName'
    },
    children: 'Foo children',
    onPanelToggle: () => null
};
const shallowStateLess = createShallowRenderer(StatelessToggablePanel, stateLessDefaultProps);

const HeadlineComponent = createStubComponent('HeadlineComponent');
const IconButtonComponent = createStubComponent('IconButtonComponent');

const defaultPropsFullRendering = {
    ...defaultThemeProps,
    HeadlineComponent,
    IconButtonComponent
};

test('<ToggablePanel/> should initialize with a state of {isOpen: props.isOpen}.', () => {
    const node = shallow();

    expect(node.state('isOpen')).toBe(false);
});
test('<ToggablePanel/> should toggle the "isOpen" state when calling the instance "toggle" method.', () => {
    const node = shallow();

    expect(node.state('isOpen')).toBe(false);

    node.instance().toggle();

    expect(node.state('isOpen')).toBe(true);
});
test('<ToggablePanel/> should render a "StatelessToggablePanel" component.', () => {
    const node = shallow().find(StatelessToggablePanel);

    expect(node.length).toBe(1);
});
test('<ToggablePanel/> should propagate the rest of the passed props to the "StatelessToggablePanel" component.', () => {
    const node = shallow({className: 'testClassName'}).find(StatelessToggablePanel);

    expect(node.prop('className')).toBe('testClassName');
});
test('<ToggablePanel/> should propagate the "isOpen" prop to the the "StatelessToggablePanel" component in case a "onPanelToggle" prop was provided.', () => {
    const node = shallow({isOpen: true, onPanelToggle: () => null}).find(StatelessToggablePanel);

    expect(node.prop('isOpen')).toBe(true);
});
test('<ToggablePanel/> should propagate the "onPanelToggle" prop to the the "StatelessToggablePanel" component in case it was provided.', () => {
    const onPanelToggle = () => null;
    const node = shallow({isOpen: true, onPanelToggle}).find(StatelessToggablePanel);

    expect(node.prop('onPanelToggle')).toBe(onPanelToggle);
});
test('<ToggablePanel/> should propagate the "isOpen" state to the the "StatelessToggablePanel" component in case no "onPanelToggle" prop was provided.', () => {
    const wrapper = shallow();
    const node = wrapper.find(StatelessToggablePanel);

    expect(node.prop('isOpen')).toBe(wrapper.state('isOpen'));
});
test('<ToggablePanel/> should propagate the "toggle" instance method to the the "StatelessToggablePanel" component in case no "onPanelToggle" prop was provided.', () => {
    const wrapper = shallow();
    const node = wrapper.find(StatelessToggablePanel);

    expect(node.prop('onPanelToggle')).toBe(wrapper.instance().toggle);
});

test('<StatelessToggablePanel/> should render only the "panel" className of the theme in any case.', () => {
    const wrapper = shallowStateLess(null);

    expect(wrapper.hasClass(stateLessDefaultProps.theme.panel)).toBeTruthy();
    expect(wrapper.hasClass(stateLessDefaultProps.theme['panel--isOpen'])).toBeFalsy();
});
test('<StatelessToggablePanel/> should render both the "panel" and "panel--isOpen" className of the theme in case the "isOpen" prop is truthy.', () => {
    const wrapper = shallowStateLess({isOpen: true});

    expect(wrapper.hasClass(stateLessDefaultProps.theme.panel)).toBeTruthy();
    expect(wrapper.hasClass(stateLessDefaultProps.theme['panel--isOpen'])).toBeTruthy();
});
test('<StatelessToggablePanel/> should render the "className" prop if provided.', () => {
    const wrapper = shallowStateLess({isOpen: true, className: 'FooClassName'});

    expect(wrapper.hasClass('FooClassName')).toBeTruthy();
});
test('<StatelessToggablePanel/> should render its propagated children.', () => {
    const wrapper = shallowStateLess();

    expect(wrapper.html().includes('Foo children')).toBeTruthy();
});

const fullyRenderToggablePanel = isOpen => {
    return render(<ToggablePanel isOpen={isOpen} {...defaultPropsFullRendering}>
        <Header {...defaultPropsFullRendering}>My Header</Header>
        <Contents {...defaultPropsFullRendering}>My my Content</Contents>
    </ToggablePanel>);
};

const getHeaderDomNode = panelDomNode => panelDomNode;

const getContentsDomNode = panelDomNode =>
    panelDomNode.children('section').children('div').first().next();

test('open ToggablePanel should render a <ToggablePanel.Header/> with an "aria-expanded" attribute of "true".', () => {
    const wrapper = fullyRenderToggablePanel(true);
    console.error(getHeaderDomNode(wrapper).html());
    console.error(getHeaderDomNode(wrapper).equals('<div />'));

    expect(getHeaderDomNode(wrapper).attr('aria-expanded')).toBeTruthy();
});

test('closed ToggablePanel should render a <ToggablePanel.Header/> with an "aria-expanded" attribute of "false".', () => {
    const wrapper = fullyRenderToggablePanel(false);

    expect(getHeaderDomNode(wrapper).attr('aria-expanded')).toBe('false');
});

test('<ToggablePanel.Header/> should render a "HeadlineComponent" and "IconButtonComponent" component.', () => {
    const wrapper = fullyRenderToggablePanel(false);

    expect(wrapper.find('[data-component-name=HeadlineComponent]').length).toBe(1);
    expect(wrapper.find('[data-component-name=IconButtonComponent]').length).toBe(1);
});
test('<ToggablePanel.Header/> should render a "HeadlineComponent" with the themes "panel__headline" className.', () => {
    const wrapper = fullyRenderToggablePanel(false);

    expect(
        getHeaderDomNode(wrapper).find('[data-component-name=HeadlineComponent]').attr('class')
    ).toBe(defaultThemeProps.theme.panel__headline);
});
test('<ToggablePanel.Header/> should render all children within the "HeadlineComponent".', () => {
    const wrapper = fullyRenderToggablePanel(false);
    expect(getHeaderDomNode(wrapper).text()).toBe('My Header');
});

test('<ToggablePanel.Header/> should render a "IconButtonComponent" with an icon of "chevron-down" if the "isOpen" context is falsy.', () => {
    const wrapper = fullyRenderToggablePanel(false);
    expect(
        getHeaderDomNode(wrapper).find('[data-component-name=IconButtonComponent]').attr('icon')
    ).toBe('chevron-down');
});

test('<ToggablePanel.Header/> should render a "IconButtonComponent" with an icon of "chevron-up" if the "isOpen" context is truthy.', () => {
    const wrapper = fullyRenderToggablePanel(true);
    expect(
        getHeaderDomNode(wrapper).find('[data-component-name=IconButtonComponent]').attr('icon')
    ).toBe('chevron-up');
});

test('<ToggablePanel.Contents/> should render the themes "panel__contents" className.', () => {
    const wrapper = fullyRenderToggablePanel(true);
    expect(
        getContentsDomNode(wrapper).find('[aria-hidden]').hasClass(defaultThemeProps.theme.panel__contents)
    ).toBeTruthy();
});

test('<ToggablePanel.Contents/> should render a falsy "aria-hidden" attribute if the "isOpen" context is truthy.', () => {
    const wrapper = fullyRenderToggablePanel(true);
    expect(getContentsDomNode(wrapper).find('[aria-hidden]').attr('aria-hidden')).toBe('false');
});
test('<ToggablePanel.Contents/> should render a truthy "aria-hidden" attribute if the "isOpen" context is falsy.', () => {
    const wrapper = fullyRenderToggablePanel(false);
    expect(getContentsDomNode(wrapper).find('[aria-hidden]').attr('aria-hidden')).toBe('true');
});
