import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import DialogWithOverlay, {DialogProps, DialogWithoutOverlay} from './dialog';

describe('<Dialog/>', () => {
    const props: DialogProps = {
        actions: ['Foo 1', 'Foo 2'],
        children: 'Foo children',
        isOpen: true,
        autoFocus: true,
        onRequestClose: () => null,
        style: 'wide',
        type: 'error',
        theme: {
            'dialog': 'dialogClassName',
            'dialog--narrow': 'narrowClassName',
            'dialog--wide': 'wideClassName',
            'dialog--jumbo': 'jumboClassName',
            'dialog--success': 'successClassName',
            'dialog--warn': 'warnClassName',
            'dialog--error': 'errorClassName',
            'dialog__actions': 'actionsClassName',
            'dialog__body': 'bodyClassName',
            'dialog__closeBtn': 'closeBtnClassName',
            'dialog__contents': 'contentsClassName',
            'dialog__contentsPosition': 'contentsPositionClassName',
            'dialog__title': 'titleClassName',
        },
        title: 'Foo title',
    };

    it('Portal should render correctly.', () => {
        const wrapper = shallow(<DialogWithOverlay {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Content should render correctly.', () => {
        const wrapper = shallow(<DialogWithoutOverlay {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render the "dialog--wide" className from the "theme" prop if the style is wide.', () => {
        const wrapper = shallow(<DialogWithOverlay {...props} style="wide"/>);
        const section = wrapper.find('section');

        expect(section.prop('className')).toContain('wideClassName');
    });

    it('should render the "dialog--jumbo" className from the "theme" prop if the style is jumbo.', () => {
        const wrapper = shallow(<DialogWithOverlay {...props} style="jumbo"/>);
        const section = wrapper.find('section');

        expect(section.prop('className')).toContain('jumboClassName');
    });

    it('should render the "dialog--narrow" className from the "theme" prop if the style is narrow.', () => {
        const wrapper = shallow(<DialogWithOverlay {...props} style="narrow"/>);
        const section = wrapper.find('section');

        expect(section.prop('className')).toContain('narrowClassName');
    });

    it('should render the actions if passed.', () => {
        const wrapper = shallow(<DialogWithoutOverlay {...props}/>);

        expect(wrapper.html().includes('Foo 1')).toBeTruthy();
        expect(wrapper.html().includes('Foo 2')).toBeTruthy();
    });
});
