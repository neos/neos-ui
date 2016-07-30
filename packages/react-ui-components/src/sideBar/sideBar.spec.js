import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import SideBar from './sideBar.js';

const defaultProps = {
    position: 'left',
    children: 'Foo children',
    theme: {}
};

test('<SideBar/> should render a "label" node.', t => {
    const bar = shallow(<SideBar {...defaultProps}/>);

    t.truthy(bar.type() === 'div');
});
test('<SideBar/> should add the passed "className" prop to the rendered node if passed.', t => {
    const bar = shallow(<SideBar {...defaultProps} className="test"/>);

    t.truthy(bar.hasClass('test'));
});
