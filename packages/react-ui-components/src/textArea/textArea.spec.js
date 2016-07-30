import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';

import TextArea from './textArea.js';

const defaultProps = {
    theme: {}
};

test('<TextArea/> should render a "button" node with the role="button" attribute.', t => {
    const input = shallow(<TextArea {...defaultProps} className="test"/>);

    t.truthy(input.hasClass('test'));
});
test('<TextArea/> should call the passed "onFocus" prop when focusing the button.', t => {
    const spy = sinon.spy();
    const input = shallow(<TextArea {...defaultProps} onFocus={spy}/>);

    input.simulate('focus');

    t.truthy(spy.callCount === 1);
});
test('<TextArea/> should call the passed "onChange" prop with the value of the input when changing it.', t => {
    const spy = sinon.spy();
    const input = shallow(<TextArea {...defaultProps} onChange={spy}/>);

    input.simulate('change', {
        target: {
            value: 'my value'
        }
    });

    t.truthy(spy.callCount === 1);
    t.truthy(spy.args[0][0] === 'my value');
});
test('<TextArea/> should call the passed "onBlur" prop when leaving the focused state of the input.', t => {
    const spy = sinon.spy();
    const input = shallow(<TextArea {...defaultProps} onBlur={spy}/>);

    input.simulate('blur');

    t.truthy(spy.callCount === 1);
});
