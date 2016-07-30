import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import Grid from './index.js';

test('<Grid/> should initially have a falsy "isOpen" state value.', t => {
    const grid = shallow(<Grid />);

    t.truthy(grid.type() === 'div');
});
test('<Grid/> should add the passed "className" prop to the rendered div if passed.', t => {
    const grid = shallow(<Grid className="test" />);

    t.truthy(grid.hasClass('test'));
});
