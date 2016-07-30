import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {noop, renderJSX} from 'jsx-test-helpers';
import {fixtureFactory} from './../_lib/testUtils.js';

import Bar from './index.js';

const defaultProps = {
    children: 'Foo children'
};
const fixture = props => <div {...props} onDragOver={noop} onDrop={noop}/>;
const generateFixture = fixtureFactory(fixture, defaultProps);

test('<Bar/> should render the passed "className" prop to the rendered wrapper if passed.', (t) => {
    const props = {className: 'test'};
    const actual = renderJSX(
        <Bar {...defaultProps} {...props} position="top"/>
    );
    const expected = generateFixture(props);

    t.deepEqual(actual, expected);
});

test('<Bar/> should call the passed "onDrop" prop when clicking the button.', (t) => {
    const props = {onDrop: sinon.spy()};

    renderJSX(
        <Bar {...defaultProps} {...props}/>,
        render => render.props.onDrop({preventDefault: noop})
    );

    t.truthy(props.onDrop.calledOnce);
});
