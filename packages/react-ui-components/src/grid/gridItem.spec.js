import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import GridItem from './gridItem.js';

const defaultProps = {
    theme: {},
    width: 'third'
};

test('<GridItem/> should render a "div" node.', t => {
    const grid = shallow(<GridItem {...defaultProps}/>);

    t.truthy(grid.type() === 'div');
});
test('<GridItem/> should add the passed "className" prop to the rendered div if passed.', t => {
    const grid = shallow(<GridItem {...defaultProps} className="test"/>);

    t.truthy(grid.hasClass('test'));
});
test('<GridItem/> should render a inline style matching the passed "width" prop.', t => {
    const grid = shallow(<GridItem {...defaultProps} width="half"/>);

    t.truthy(grid.html().includes('style="width:50%;"'));
});
