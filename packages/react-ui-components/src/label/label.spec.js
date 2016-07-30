import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import Label from './label.js';

const defaultProps = {
    theme: {}
};

test('<Label/> should render a "label" node.', t => {
    const label = shallow(<Label {...defaultProps} htmlFor="test"/>);

    t.truthy(label.type() === 'label');
});
test('<Label/> should add the passed "className" prop to the rendered node if passed.', t => {
    const label = shallow(<Label {...defaultProps} htmlFor="test" className="test"/>);

    t.truthy(label.hasClass('test'));
});
