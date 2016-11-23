import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import Dialog from './dialog.js';
import Portal from 'react-portal';

const IconButtonComponent = createStubComponent();
const defaultProps = {
    isOpen: false,
    theme: {
        'dialog--wide': 'wideClassName'
    },
    children: 'Foo children',
    actions: ['Foo 1', 'Foo 2'],
    onRequestClose: () => null,
    IconButtonComponent
};
const shallow = createShallowRenderer(Dialog, defaultProps);

test('should render a "Portal" as the wrapping Component.', t => {
    const portal = shallow().find(Portal);

    t.is(portal.length, 1);
});
test('should pas a falsy "isOpened" tag to the "Portal" component if the "isOpen" prop is falsy.', t => {
    const portal = shallow().find(Portal);

    t.is(portal.prop('isOpened'), false);
});
test('should pas a truthy "isOpened" tag to the "Portal" component if the "isOpen" prop is truthy.', t => {
    const portal = shallow({isOpen: true}).find(Portal);

    t.is(portal.prop('isOpened'), true);
});
test('should render a "section" inside the portal with the attribute role="dialog".', t => {
    const portal = shallow().find(Portal);
    const section = portal.find('section');

    t.is(section.length, 1);
    t.truthy(section.html().includes('role="dialog"'));
});
test('should render the "className" prop if passed.', t => {
    const portal = shallow({
        className: 'barClassName'
    }).find(Portal);
    const section = portal.find('section');

    t.truthy(section.hasClass('barClassName'));
});
test('should render the "dialog--wide" className from the "theme" prop if the "isWide" prop is truthy.', t => {
    const portal = shallow({
        isWide: true
    }).find(Portal);
    const section = portal.find('section');

    t.truthy(section.hasClass('wideClassName'));
});
test('should render the actions if passed.', t => {
    const portal = shallow().find(Portal);
    const section = portal.find('section');

    t.truthy(section.html().includes('Foo 1'));
    t.truthy(section.html().includes('Foo 2'));
});
test('should call the "onRequestClose" prop when clicking on the "IconButtonComponent" component.', t => {
    const onRequestClose = sinon.spy();
    const portal = shallow({onRequestClose}).find(Portal);
    const btn = portal.find(IconButtonComponent);

    btn.simulate('click');

    t.truthy(onRequestClose.calledOnce);
});
