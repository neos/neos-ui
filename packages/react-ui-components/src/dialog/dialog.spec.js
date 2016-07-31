import React from 'react';
import test from 'ava';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Dialog from './dialog.js';

const PortalComponent = props => <div {...props}/>;
const IconButtonComponent = props => <div {...props}/>;
const defaultProps = {
    isChecked: false,
    theme: {},
    PortalComponent,
    IconButtonComponent
};
const shallow = createShallowRenderer(Dialog, defaultProps);

test('should render a "PortalComponent" as the wrapping Component.', t => {
    const portal = shallow().find(PortalComponent);

    t.is(portal.length, 1);
});
test('should render a "section" inside the portal with the attribute role="dialog".', t => {
    const portal = shallow().find(PortalComponent);
    const section = portal.find('section');

    t.is(section.length, 1);
    t.truthy(section.html().includes('role="dialog"'));
});
test('should render the "className" prop if passed.', t => {
    const portal = shallow({
        className: 'barClassName'
    }).find(PortalComponent);
    const section = portal.find('section');

    t.truthy(section.hasClass('barClassName'));
});
test('should all actions if passed.', t => {
    const portal = shallow({
        className: 'barClassName',
        actions: ['Foo 1', 'Foo 2']
    }).find(PortalComponent);
    const section = portal.find('section');

    t.truthy(section.html().includes('Foo 1'));
    t.truthy(section.html().includes('Foo 2'));
});
