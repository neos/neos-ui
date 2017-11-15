import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import {DialogWithoutEscape as Dialog} from './dialog.js';
import Portal from 'react-portal';

const IconButtonComponent = createStubComponent();
const defaultProps = {
    isOpen: false,
    theme: {
        'dialog--wide': 'wideClassName',
        'dialog--narrow': 'narrowClassName'
    },
    children: 'Foo children',
    actions: ['Foo 1', 'Foo 2'],
    onRequestClose: () => null,
    IconButtonComponent
};
const shallow = createShallowRenderer(Dialog, defaultProps);

test('should render a "Portal" as the wrapping Component.', () => {
    const portal = shallow().find(Portal);

    expect(portal.length).toBe(1);
});
test('should pas a falsy "isOpened" tag to the "Portal" component if the "isOpen" prop is falsy.', () => {
    const portal = shallow().find(Portal);

    expect(portal.prop('isOpened')).toBe(false);
});
test('should pas a truthy "isOpened" tag to the "Portal" component if the "isOpen" prop is truthy.', () => {
    const portal = shallow({isOpen: true}).find(Portal);

    expect(portal.prop('isOpened')).toBe(true);
});
test('should render a "section" inside the portal with the attribute role="dialog".', () => {
    const portal = shallow().find(Portal);
    const section = portal.find('section');

    expect(section.length).toBe(1);
    expect(section.html().includes('role="dialog"')).toBeTruthy();
});
test('should render the "className" prop if passed.', () => {
    const portal = shallow({
        className: 'barClassName'
    }).find(Portal);
    const section = portal.find('section');

    expect(section.hasClass('barClassName')).toBeTruthy();
});
test('should render the "dialog--wide" className from the "theme" prop if the style is wide.', () => {
    const portal = shallow({
        style: 'wide'
    }).find(Portal);
    const section = portal.find('section');

    expect(section.hasClass('wideClassName')).toBeTruthy();
});
test('should render the "dialog--narrow" className from the "theme" prop if the style is narrow.', () => {
    const portal = shallow({
        style: 'narrow'
    }).find(Portal);
    const section = portal.find('section');

    expect(section.hasClass('narrowClassName')).toBeTruthy();
});
test('should render the actions if passed.', () => {
    const portal = shallow().find(Portal);
    const section = portal.find('section');

    expect(section.html().includes('Foo 1')).toBeTruthy();
    expect(section.html().includes('Foo 2')).toBeTruthy();
});
test('should call the "onRequestClose" prop when clicking on the "IconButtonComponent" component.', () => {
    const onRequestClose = jest.fn();
    const portal = shallow({onRequestClose}).find(Portal);
    const btn = portal.find(IconButtonComponent);

    btn.simulate('click');

    expect(onRequestClose.mock.calls.length).toBe(1);
});
