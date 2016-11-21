import test from 'ava';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import {render} from 'enzyme';
import React from 'react';
import ToggablePanel, {
    StatelessToggablePanel,
    Header,
    Contents
} from './toggablePanel.js';

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

test('<ToggablePanel/> should initialize with a state of {isOpen: props.isOpen}.', t => {
    const node = shallow();

    t.is(node.state('isOpen'), false);
});
test('<ToggablePanel/> should toggle the "isOpen" state when calling the instance "toggle" method.', t => {
    const node = shallow();

    t.is(node.state('isOpen'), false);

    node.instance().toggle();

    t.is(node.state('isOpen'), true);
});
test('<ToggablePanel/> should render a "StatelessToggablePanel" component.', t => {
    const node = shallow().find(StatelessToggablePanel);

    t.is(node.length, 1);
});
test('<ToggablePanel/> should propagate the rest of the passed props to the "StatelessToggablePanel" component.', t => {
    const node = shallow({className: 'testClassName'}).find(StatelessToggablePanel);

    t.is(node.prop('className'), 'testClassName');
});
test('<ToggablePanel/> should propagate the "isOpen" prop to the the "StatelessToggablePanel" component in case a "onPanelToggle" prop was provided.', t => {
    const node = shallow({isOpen: true, onPanelToggle: () => null}).find(StatelessToggablePanel);

    t.is(node.prop('isOpen'), true);
});
test('<ToggablePanel/> should propagate the "onPanelToggle" prop to the the "StatelessToggablePanel" component in case it was provided.', t => {
    const onPanelToggle = () => null;
    const node = shallow({isOpen: true, onPanelToggle}).find(StatelessToggablePanel);

    t.is(node.prop('onPanelToggle'), onPanelToggle);
});
test('<ToggablePanel/> should propagate the "isOpen" state to the the "StatelessToggablePanel" component in case no "onPanelToggle" prop was provided.', t => {
    const wrapper = shallow();
    const node = wrapper.find(StatelessToggablePanel);

    t.is(node.prop('isOpen'), wrapper.state('isOpen'));
});
test('<ToggablePanel/> should propagate the "toggle" instance method to the the "StatelessToggablePanel" component in case no "onPanelToggle" prop was provided.', t => {
    const wrapper = shallow();
    const node = wrapper.find(StatelessToggablePanel);

    t.is(node.prop('onPanelToggle'), wrapper.instance().toggle);
});

test('<StatelessToggablePanel/> should render only the "panel" className of the theme in any case.', t => {
    const wrapper = shallowStateLess(null);

    t.truthy(wrapper.childAt(0).hasClass(stateLessDefaultProps.theme.panel));
    t.falsy(wrapper.childAt(0).hasClass(stateLessDefaultProps.theme['panel--isOpen']));
});
test('<StatelessToggablePanel/> should render both the "panel" and "panel--isOpen" className of the theme in case the "isOpen" prop is truthy.', t => {
    const wrapper = shallowStateLess({isOpen: true});

    t.truthy(wrapper.childAt(0).hasClass(stateLessDefaultProps.theme.panel));
    t.truthy(wrapper.childAt(0).hasClass(stateLessDefaultProps.theme['panel--isOpen']));
});
test('<StatelessToggablePanel/> should render the "className" prop if provided.', t => {
    const wrapper = shallowStateLess({isOpen: true, className: 'FooClassName'});

    t.truthy(wrapper.childAt(0).hasClass('FooClassName'));
});
test('<StatelessToggablePanel/> should render its propagated children.', t => {
    const wrapper = shallowStateLess();

    t.truthy(wrapper.html().includes('Foo children'));
});

const fullyRenderToggablePanel = isOpen => {
    return render(<ToggablePanel isOpen={isOpen} {...defaultPropsFullRendering}>
        <Header {...defaultPropsFullRendering}>My Header</Header>
        <Contents {...defaultPropsFullRendering}>My my Content</Contents>
    </ToggablePanel>);
};

const getHeaderDomNode = panelDomNode =>
    panelDomNode.children('section').children('div').first();

const getContentsDomNode = panelDomNode =>
    panelDomNode.children('section').children('div').first().next();

test('open ToggablePanel should render a <ToggablePanel.Header/> with an "aria-expanded" attribute of "true".', t => {
    const wrapper = fullyRenderToggablePanel(true);

    t.truthy(getHeaderDomNode(wrapper).attr('aria-expanded'));
});

test('closed ToggablePanel should render a <ToggablePanel.Header/> with an "aria-expanded" attribute of "false".', t => {
    const wrapper = fullyRenderToggablePanel(false);

    t.is(getHeaderDomNode(wrapper).attr('aria-expanded'), 'false');
});

test('<ToggablePanel.Header/> should render a "HeadlineComponent" and "IconButtonComponent" component.', t => {
    const wrapper = fullyRenderToggablePanel(false);

    t.is(wrapper.find('[data-component-name=HeadlineComponent]').length, 1);
    t.is(wrapper.find('[data-component-name=IconButtonComponent]').length, 1);
});
test('<ToggablePanel.Header/> should render a "HeadlineComponent" with the themes "panel__headline" className.', t => {
    const wrapper = fullyRenderToggablePanel(false);

    t.is(getHeaderDomNode(wrapper).find('[data-component-name=HeadlineComponent]').attr('class'), defaultThemeProps.theme.panel__headline);
});
test('<ToggablePanel.Header/> should render all children within the "HeadlineComponent".', t => {
    const wrapper = fullyRenderToggablePanel(false);
    t.is(getHeaderDomNode(wrapper).text(), 'My Header');
});

test('<ToggablePanel.Header/> should render a "IconButtonComponent" with an icon of "chevron-down" if the "isOpen" context is falsy.', t => {
    const wrapper = fullyRenderToggablePanel(false);
    t.is(getHeaderDomNode(wrapper).find('[data-component-name=IconButtonComponent]').attr('icon'), 'chevron-down');
});

test('<ToggablePanel.Header/> should render a "IconButtonComponent" with an icon of "chevron-up" if the "isOpen" context is truthy.', t => {
    const wrapper = fullyRenderToggablePanel(true);
    t.is(getHeaderDomNode(wrapper).find('[data-component-name=IconButtonComponent]').attr('icon'), 'chevron-up');
});

test('<ToggablePanel.Contents/> should render the themes "panel__contents" className.', t => {
    const wrapper = fullyRenderToggablePanel(true);
    t.truthy(getContentsDomNode(wrapper).find('[aria-hidden]').hasClass(defaultThemeProps.theme.panel__contents));
});

test('<ToggablePanel.Contents/> should render a falsy "aria-hidden" attribute if the "isOpen" context is truthy.', t => {
    const wrapper = fullyRenderToggablePanel(true);
    t.is(getContentsDomNode(wrapper).find('[aria-hidden]').attr('aria-hidden'), 'false');
});
test('<ToggablePanel.Contents/> should render a truthy "aria-hidden" attribute if the "isOpen" context is falsy.', t => {
    const wrapper = fullyRenderToggablePanel(false);
    t.is(getContentsDomNode(wrapper).find('[aria-hidden]').attr('aria-hidden'), 'true');
});
