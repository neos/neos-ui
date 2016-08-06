import test from 'ava';
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
    togglePanel: () => null
};
const shallowStateLess = createShallowRenderer(StatelessToggablePanel, stateLessDefaultProps);

const HeadlineComponent = createStubComponent();
const IconButtonComponent = createStubComponent();
const headerDefaultProps = {
    theme: {// eslint-disable-line quote-props
        'panel__headline': 'panelHeadlineClassName',
        'panel__toggleBtn': 'panelToggleBtnClassName'
    },
    children: 'Foo children',
    HeadlineComponent,
    IconButtonComponent
};
const shallowHeader = createShallowRenderer(Header, headerDefaultProps);

const contentsDefaultProps = {
    theme: {// eslint-disable-line quote-props
        'panel__contents': 'panelContentsClassName'
    }
};
const shallowContents = createShallowRenderer(Contents, contentsDefaultProps);

test('<ToggablePanel/> should render a "StatelessToggablePanel" component.', t => {
    const node = shallow().find(StatelessToggablePanel);

    t.is(node.length, 1);
});
test('<ToggablePanel/> should propagate the rest of the passed props to the "StatelessToggablePanel" component.', t => {
    const node = shallow({className: 'testClassName'}).find(StatelessToggablePanel);

    t.is(node.prop('className'), 'testClassName');
});
test('<ToggablePanel/> should propagate the "isOpen" prop to the the "StatelessToggablePanel" component in case a "togglePanel" prop was provided.', t => {
    const node = shallow({isOpen: true, togglePanel: () => null}).find(StatelessToggablePanel);

    t.is(node.prop('isOpen'), true);
});
test('<ToggablePanel/> should propagate the "togglePanel" prop to the the "StatelessToggablePanel" component in case it was provided.', t => {
    const togglePanel = () => null;
    const node = shallow({isOpen: true, togglePanel}).find(StatelessToggablePanel);

    t.is(node.prop('togglePanel'), togglePanel);
});
test('<ToggablePanel/> should propagate the "isOpen" state to the the "StatelessToggablePanel" component in case no "togglePanel" prop was provided.', t => {
    const wrapper = shallow();
    const node = wrapper.find(StatelessToggablePanel);

    t.is(node.prop('isOpen'), wrapper.state('isOpen'));
});
test('<ToggablePanel/> should propagate the "toggle" instance method to the the "StatelessToggablePanel" component in case no "togglePanel" prop was provided.', t => {
    const wrapper = shallow();
    const node = wrapper.find(StatelessToggablePanel);

    t.is(node.prop('togglePanel'), wrapper.instance().toggle);
});

test('<StatelessToggablePanel/> should render only the "panel" className of the theme in any case.', t => {
    const wrapper = shallowStateLess(null);

    t.truthy(wrapper.hasClass(stateLessDefaultProps.theme.panel));
    t.falsy(wrapper.hasClass(stateLessDefaultProps.theme['panel--isOpen']));
});
test('<StatelessToggablePanel/> should render both the "panel" and "panel--isOpen" className of the theme in case the "isOpen" prop is truthy.', t => {
    const wrapper = shallowStateLess({isOpen: true});

    t.truthy(wrapper.hasClass(stateLessDefaultProps.theme.panel));
    t.truthy(wrapper.hasClass(stateLessDefaultProps.theme['panel--isOpen']));
});
test('<StatelessToggablePanel/> should render its propagated children.', t => {
    const wrapper = shallowStateLess();

    t.truthy(wrapper.html().includes('Foo children'));
});

test('<ToggablePanel.Header/> should render a "HeadlineComponent" and "IconButtonComponent" component.', t => {
    const context = shallowStateLess({isOpen: true});
    const header = shallowHeader(null, context);

    t.is(header.find(HeadlineComponent).length, 1);
    t.is(header.find(IconButtonComponent).length, 1);
});

test('<ToggablePanel.Contents/> should render the themes "panel__contents" className.', t => {
    const context = shallowStateLess({isOpen: true});
    const contents = shallowContents(null, context);
    const div = contents.find('[aria-hidden]');

    t.truthy(div.hasClass(contentsDefaultProps.theme.panel__contents));
});
test('<ToggablePanel.Contents/> should render the props "className" if provided.', t => {
    const context = shallowStateLess({isOpen: true});
    const contents = shallowContents({className: 'FooClassName'}, context);
    const div = contents.find('[aria-hidden]');

    t.truthy(div.hasClass('FooClassName'));
});
