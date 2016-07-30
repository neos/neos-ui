import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import GridItem from './gridItem.js';

test('<GridItem/> should render a "div" node.', t => {
    const grid = shallow(<GridItem/>);

    t.truthy(grid.type() === 'div');
});
test('<GridItem/> should add the passed "className" prop to the rendered div if passed.', t => {
    const grid = shallow(<GridItem className="test"/>);

    t.truthy(grid.hasClass('test'));
});
test('<GridItem/> should add the passed "width" prop to the inline-style of the rendered div.', t => {
    const grid = shallow(<GridItem className="test"/>);

    t.truthy(grid.html().includes('style="width:50%;"'));
});
