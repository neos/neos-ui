import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';

import Bar from './bar.js';

const defaultProps = {
    theme: {},
    children: 'Foo children'
};
test('<Bar/> should render the passed "className" prop to the rendered wrapper if passed.', t => {
    const props = {className: 'test'};
    const bar = shallow(
        <Bar {...defaultProps} {...props} position="top"/>
    );

    t.truthy(bar.hasClass('test'));
});

test('<Bar/> should call the passed "onDrop" prop when clicking the button.', t => {
    const props = {onDrop: sinon.spy()};
    const bar = shallow(
        <Bar {...defaultProps} {...props} position="top"/>
    );

    bar.simulate('drop');

    t.truthy(props.onDrop.calledOnce);
});
