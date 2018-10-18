import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Portal from 'react-portal';

import IconButton from '../IconButton';
import {DialogProps, DialogWithoutEscape as Dialog} from './dialog';

describe('<Dialog/>', () => {
    const props: DialogProps = {
        actions: ['Foo 1', 'Foo 2'],
        children: 'Foo children',
        isOpen: false,
        onRequestClose: () => null,
        style: 'wide',
        theme: {
            'dialog': 'dialogClassName',
            'dialog--narrow': 'narrowClassName',
            'dialog--wide': 'wideClassName',
            'dialog__actions': 'actionsClassName',
            'dialog__body': 'bodyClassName',
            'dialog__closeBtn': 'closeBtnClassName',
            'dialog__contents': 'contentsClassName',
            'dialog__contentsPosition': 'contentsPositionClassName',
            'dialog__title': 'titleClassName',
        },
        title: 'Foo title',
    };

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
        const wrapper = shallow(<Dialog {...props} isOpen={true}/>);
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
        const btn = portal.find(IconButton);

        btn.simulate('click');

        expect(onRequestClose.mock.calls.length).toBe(1);
    });
});
