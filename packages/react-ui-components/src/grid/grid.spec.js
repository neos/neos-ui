import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import Grid from './grid.js';

const defaultProps = {
    children: 'Foo children',
    theme: {}
};

test('<Grid/> should initially have a falsy "isOpen" state value.', t => {
    const grid = shallow(<Grid {...defaultProps}/>);

    t.truthy(grid.type() === 'div');
});
test('<Grid/> should add the passed "className" prop to the rendered div if passed.', t => {
    const grid = shallow(<Grid {...defaultProps} className="test"/>);

    t.truthy(grid.hasClass('test'));
});
