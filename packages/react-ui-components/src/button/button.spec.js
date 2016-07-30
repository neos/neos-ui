import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';

import Button from './button.js';

const defaultProps = {
    theme: {},
    className: 'foo className',
    children: 'Foo children'
};

test('<Button/> should render a "button" node with the role="button" attribute.', t => {
    const props = {
        onClick: sinon.spy(),
        style: 'clean'
    };
    const btn = shallow(
        <Button {...defaultProps} {...props}/>
    );

    t.truthy(btn.type() === 'button');
});
test('<Button/> should render a "button" and respect the "className" prop if passed.', t => {
    const props = {
        onClick: sinon.spy(),
        style: 'clean',
        className: 'bar className'
    };
    const btn = shallow(
        <Button {...defaultProps} {...props}/>
    );

    t.truthy(btn.html().includes('class="bar className"'));
});
test('<Button/> should call the passed "onClick" prop when clicking the button.', t => {
    const props = {
        onClick: sinon.spy(),
        style: 'clean'
    };
    const btn = shallow(
        <Button {...defaultProps} {...props}/>
    );

    btn.simulate('click');

    t.truthy(props.onClick.calledOnce);
});
test('<Button/> should call the passed "onMouseDown" prop when clicking the button.', t => {
    const props = {
        onClick: sinon.spy(),
        onMouseDown: sinon.spy(),
        style: 'clean'
    };
    const btn = shallow(
        <Button {...defaultProps} {...props}/>
    );

    btn.simulate('mouseDown');

    t.truthy(props.onMouseDown.calledOnce);
});
test('<Button/> should call the passed "onMouseUp" prop when clicking the button.', t => {
    const props = {
        onClick: sinon.spy(),
        onMouseUp: sinon.spy(),
        style: 'clean'
    };
    const btn = shallow(
        <Button {...defaultProps} {...props}/>
    );

    btn.simulate('mouseUp');

    t.truthy(props.onMouseUp.calledOnce);
});
test('<Button/> should call the passed "onMouseEnter" prop when clicking the button.', t => {
    const props = {
        onClick: sinon.spy(),
        onMouseEnter: sinon.spy(),
        style: 'clean'
    };
    const btn = shallow(
        <Button {...defaultProps} {...props}/>
    );

    btn.simulate('mouseEnter');

    t.truthy(props.onMouseEnter.calledOnce);
});
test('<Button/> should call the passed "onMouseLeave" prop when clicking the button.', t => {
    const props = {
        onClick: sinon.spy(),
        onMouseLeave: sinon.spy(),
        style: 'clean'
    };
    const btn = shallow(
        <Button {...defaultProps} {...props}/>
    );

    btn.simulate('mouseLeave');

    t.truthy(props.onMouseLeave.calledOnce);
});
test('<Button/> should render the disabled attribute when passing a truthy "isDisabled" prop.', t => {
    const props = {
        onClick: sinon.spy(),
        isDisabled: true,
        style: 'clean'
    };
    const btn = shallow(
        <Button {...defaultProps} {...props}/>
    );

    t.truthy(btn.html().includes('disabled=""'));
});
