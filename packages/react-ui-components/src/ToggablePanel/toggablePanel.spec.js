import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils';
import ToggablePanel, {
    StatelessToggablePanel,
    Header,
    Contents
} from './toggablePanel';

describe('<ToggablePanel/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                'panel': 'baseClassName',
                'panel--isOpen': 'isOpenClassName',
                'panel__headline': 'panelHeadlineClassName',
                'panel__contents': 'panelContentsClassName'
            },
            HeadlineComponent: createStubComponent('HeadlineComponent'),
            IconButtonComponent: createStubComponent('IconButtonComponent')
        };
        props.children = [
            <Header key="header" {...props}>My Header</Header>,
            <Contents key="contents" {...props}>My my Content</Contents>
        ];
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<ToggablePanel {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ToggablePanel {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<ToggablePanel {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should initialize with a state of {isOpen: props.isOpen}.', () => {
        const wrapper = shallow(<ToggablePanel {...props}/>);

        expect(wrapper.state('isOpen')).toBe(true);
    });

    it('should toggle the "isOpen" state when calling the instance "toggle" method.', () => {
        const wrapper = shallow(<ToggablePanel {...props}/>);

        expect(wrapper.state('isOpen')).toBe(true);

        wrapper.instance().toggle();

        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('should propagate the "isOpen" prop to the the "StatelessToggablePanel" component in case a "onPanelToggle" prop was provided.', () => {
        const onPanelToggle = () => null;
        const wrapper = shallow(<ToggablePanel {...props} onPanelToggle={onPanelToggle} isOpen/>);

        expect(wrapper.prop('isOpen')).toBe(true);
    });

    it('should propagate the "onPanelToggle" prop to the the "StatelessToggablePanel" component in case it was provided.', () => {
        const onPanelToggle = () => null;
        const wrapper = shallow(<ToggablePanel {...props} onPanelToggle={onPanelToggle}/>);

        expect(wrapper.prop('onPanelToggle')).toBe(onPanelToggle);
    });

    it('should propagate the "isOpen" state to the the "StatelessToggablePanel" component in case no "onPanelToggle" prop was provided.', () => {
        const wrapper = shallow(<ToggablePanel {...props}/>);

        expect(wrapper.prop('isOpen')).toBe(wrapper.state('isOpen'));
    });

    it('should propagate the "toggle" instance method to the the "StatelessToggablePanel" component in case no "onPanelToggle" prop was provided.', () => {
        const wrapper = shallow(<ToggablePanel {...props}/>);

        expect(wrapper.prop('onPanelToggle')).toBe(wrapper.instance().toggle);
    });
});

describe('<StatelessToggablePanel/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                'panel': 'baseClassName',
                'panel--isOpen': 'isOpenClassName',
                'panel__headline': 'panelHeadlineClassName',
                'panel__contents': 'panelContentsClassName'
            },
            onPanelToggle: () => null,
            children: 'Foo children',
            HeadlineComponent: createStubComponent('HeadlineComponent'),
            IconButtonComponent: createStubComponent('IconButtonComponent')
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<StatelessToggablePanel {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render both the "panel" and "panel--isOpen" className of the theme in case the "isOpen" prop is truthy.', () => {
        const wrapper = shallow(<StatelessToggablePanel {...props} isOpen/>);

        expect(wrapper.prop('className')).toContain(props.theme.panel);
        expect(wrapper.prop('className')).toContain(props.theme['panel--isOpen']);
    });
});

describe('<Header/>', () => {
    let context;
    let props;

    beforeEach(() => {
        context = {
            onPanelToggle: jest.fn()
        };
        props = {
            children: 'Foo children',
            isPanelOpen: false,
            theme: {
                'panel__headline': 'panelHeadlineClassName',
                'panel__headline--noPadding': 'panelHeadlineNoPaddingClassName',
                'panel__toggleBtn': 'panelToggleBtnClassName'
            },
            noPadding: false,
            HeadlineComponent: createStubComponent(),
            IconButtonComponent: createStubComponent(),
            openedIcon: 'opened-icon-prop',
            closedIcon: 'closed-icon-prop'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Header {...props}/>, {context});

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should propagate the "isPanelOpen" prop to the "aria-expanded" attribute.', () => {
        expect(shallow(<Header {...props} isPanelOpen/>, {context}).prop('aria-expanded')).toBeTruthy();
        expect(shallow(<Header {...props} isPanelOpen={false}/>, {context}).prop('aria-expanded')).toBeFalsy();
    });

    it('should propagate the "openedIcon" prop to the Icon component if the "isPanelOpen" prop is truthy.', () => {
        const wrapper = shallow(<Header {...props} isPanelOpen/>, {context});
        const icon = wrapper.find(props.IconButtonComponent);

        expect(icon.prop('icon')).toBe(props.openedIcon);
    });

    it('should propagate the "closedIcon" prop to the Icon component if the "isPanelOpen" prop is falsy.', () => {
        const wrapper = shallow(<Header {...props} isPanelOpen={false}/>, {context});
        const icon = wrapper.find(props.IconButtonComponent);

        expect(icon.prop('icon')).toBe(props.closedIcon);
    });
});

describe('<Contents/>', () => {
    let context;
    let props;

    beforeEach(() => {
        context = {
            onPanelToggle: jest.fn()
        };
        props = {
            children: 'Foo children',
            isPanelOpen: false,
            theme: {
                'panel__contents': 'panelContentsClassName',
                'panel__contents--noPadding': 'panelContentsNoPaddingClassName'
            },
            noPadding: false
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Contents {...props}/>, {context});

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should negate the "isPanelOpen" prop to the "aria-hidden" attribute.', () => {
        expect(shallow(<Contents {...props} isPanelOpen/>, {context}).prop('aria-hidden')).toBeFalsy();
        expect(shallow(<Contents {...props} isPanelOpen={false}/>, {context}).prop('aria-hidden')).toBeFalsy();
    });
});
