import test from 'ava';
import Collapse from 'react-collapse';
import sinon from 'sinon';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import ToggablePanel, {
    StatelessToggablePanel,
    Header,
    Contents
} from './toggablePanel.js';

const defaultProps = {
    theme: {
        'panel': 'baseClassName',
        'panel--isOpen': 'isOpenClassName'
    },
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

const HeadlineComponent = createStubComponent();
const IconButtonComponent = createStubComponent();
const headerDefaultProps = {
    theme: {/* eslint-disable quote-props */
        'panel__headline': 'panelHeadlineClassName',
        'panel__toggleBtn': 'panelToggleBtnClassName'
    }, /* eslint-enable quote-props */
    children: 'Foo children',
    HeadlineComponent,
    IconButtonComponent
};
const shallowHeader = createShallowRenderer(Header, headerDefaultProps);

const contentsDefaultProps = {
    theme: {/* eslint-disable quote-props */
        'panel__contents': 'panelContentsClassName'
    }, /* eslint-enable quote-props */
    children: 'Foo children'
};
const shallowContents = createShallowRenderer(Contents, contentsDefaultProps);

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

test('<ToggablePanel.Header/> should render a wrapping node with an "aria-expanded" attribute of "false" if the "isOpen" context is falsy.', t => {
    const onPanelToggle = () => null;
    const header = shallowHeader(null, {isOpen: false, onPanelToggle});

    t.falsy(header.node.props['aria-expanded']);
});
test('<ToggablePanel.Header/> should render a wrapping node with an "aria-expanded" attribute of "true" if the "isOpen" context is truthy.', t => {
    const onPanelToggle = () => null;
    const broadcasts = {
        'isPanelOpen': listener => listener(true)
    };
    const header = shallowHeader(null, {broadcasts, isOpen: true, onPanelToggle});

    console.log("HEADER", header.get(0);

    t.truthy(header.node.props['aria-expanded']);
});
test('<ToggablePanel.Header/> should render a "HeadlineComponent" and "IconButtonComponent" component.', t => {
    const onPanelToggle = () => null;
    const header = shallowHeader(null, {isOpen: true, onPanelToggle});

    t.is(header.find(HeadlineComponent).length, 1);
    t.is(header.find(IconButtonComponent).length, 1);
});
test('<ToggablePanel.Header/> should render a "HeadlineComponent" with the themes "panel__headline" className.', t => {
    const onPanelToggle = () => null;
    const header = shallowHeader(null, {isOpen: true, onPanelToggle});
    const headline = header.find(HeadlineComponent);

    t.is(headline.prop('className'), headerDefaultProps.theme.panel__headline);
});
test('<ToggablePanel.Header/> should render all children within the "HeadlineComponent".', t => {
    const onPanelToggle = () => null;
    const header = shallowHeader(null, {isOpen: true, onPanelToggle});
    const headline = header.find(HeadlineComponent);

    t.is(headline.prop('children'), headerDefaultProps.children);
});
test('<ToggablePanel.Header/> should render a "IconButtonComponent" with an icon of "chevron-down" if the "isOpen" context is falsy.', t => {
    const onPanelToggle = () => null;
    const header = shallowHeader(null, {isOpen: false, onPanelToggle});
    const iconBtn = header.find(IconButtonComponent);

    t.is(iconBtn.prop('icon'), 'chevron-down');
});
test('<ToggablePanel.Header/> should render a "IconButtonComponent" with an icon of "chevron-up" if the "isOpen" context is truthy.', t => {
    const onPanelToggle = () => null;
    const header = shallowHeader(null, {isOpen: true, onPanelToggle});
    const iconBtn = header.find(IconButtonComponent);

    t.is(iconBtn.prop('icon'), 'chevron-up');
});
test('<ToggablePanel.Header/> should call the "onPanelToggle" prop when clicking on the "IconButtonComponent".', t => {
    const onPanelToggle = sinon.spy();
    const header = shallowHeader(null, {isOpen: true, onPanelToggle});
    const iconBtn = header.find(IconButtonComponent);

    iconBtn.simulate('click');

    t.truthy(onPanelToggle.calledOnce);
});

test('<ToggablePanel.Contents/> should render a "Collapse" component.', t => {
    const contents = shallowContents(null, {isOpen: true});
    const collapse = contents.find(Collapse);

    t.is(collapse.length, 1);
});
test('<ToggablePanel.Contents/> should render the themes "panel__contents" className.', t => {
    const contents = shallowContents(null, {isOpen: true});
    const div = contents.find('[aria-hidden]');

    t.truthy(div.hasClass(contentsDefaultProps.theme.panel__contents));
});
test('<ToggablePanel.Contents/> should render the props "className" if provided.', t => {
    const contents = shallowContents({className: 'FooClassName'}, {isOpen: true});
    const div = contents.find('[aria-hidden]');

    t.truthy(div.hasClass('FooClassName'));
});
test('<ToggablePanel.Contents/> should render a falsy "aria-hidden" attribute if the "isOpen" context is truthy.', t => {
    const contents = shallowContents({className: 'FooClassName'}, {isOpen: true});
    const div = contents.find('[aria-hidden]');

    t.is(div.node.props['aria-hidden'], 'false');
});
test('<ToggablePanel.Contents/> should render a truthy "aria-hidden" attribute if the "isOpen" context is falsy.', t => {
    const contents = shallowContents({className: 'FooClassName'}, {isOpen: false});
    const div = contents.find('[aria-hidden]');

    t.is(div.node.props['aria-hidden'], 'true');
});
