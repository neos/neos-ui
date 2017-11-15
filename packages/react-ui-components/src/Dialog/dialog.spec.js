import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import {DialogWithoutEscape as Dialog} from './dialog.js';
import Portal from 'react-portal';

describe('<Dialog/>', () => {
    let props;

    beforeEach(() => {
        props = {
            isOpen: false,
            theme: {
                'dialog--wide': 'wideClassName',
                'dialog--narrow': 'narrowClassName'
            },
            children: 'Foo children',
            actions: ['Foo 1', 'Foo 2'],
            onRequestClose: () => null,
            IconButtonComponent: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Dialog {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should pass a falsy "isOpened" tag to the "Portal" component if the "isOpen" prop is falsy.', () => {
        const wrapper = shallow(<Dialog {...props}/>);
        const portal = wrapper.find(Portal);

        expect(portal.prop('isOpened')).toBe(false);
    });

    it('should pass a truthy "isOpened" tag to the "Portal" component if the "isOpen" prop is truthy.', () => {
        const wrapper = shallow(<Dialog {...props} isOpen/>);
        const portal = wrapper.find(Portal);

        expect(portal.prop('isOpened')).toBe(true);
    });

    it('should render the "dialog--wide" className from the "theme" prop if the style is wide.', () => {
        const wrapper = shallow(<Dialog {...props} style="wide"/>);
        const portal = wrapper.find(Portal);
        const section = portal.find('section');

        expect(section.prop('className')).toContain('wideClassName');
    });

    it('should render the "dialog--narrow" className from the "theme" prop if the style is narrow.', () => {
        const wrapper = shallow(<Dialog {...props} style="narrow"/>);
        const portal = wrapper.find(Portal);
        const section = portal.find('section');

        expect(section.prop('className')).toContain('narrowClassName');
    });

    it('should render the actions if passed.', () => {
        const wrapper = shallow(<Dialog {...props}/>);
        const portal = wrapper.find(Portal);
        const section = portal.find('section');

        expect(section.html().includes('Foo 1')).toBeTruthy();
        expect(section.html().includes('Foo 2')).toBeTruthy();
    });

    it('should call the "onRequestClose" prop when clicking on the "IconButtonComponent" component.', () => {
        const onRequestClose = jest.fn();
        const wrapper = shallow(<Dialog {...props} onRequestClose={onRequestClose}/>);
        const portal = wrapper.find(Portal);
        const btn = portal.find(props.IconButtonComponent);

        btn.simulate('click');

        expect(onRequestClose.mock.calls.length).toBe(1);
    });
});
