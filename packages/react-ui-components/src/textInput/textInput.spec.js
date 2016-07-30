import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';

import TextInput from './textInput.js';

const defaultProps = {
    theme: {}
};

test('<TextInput/> should render an "input" node.', t => {
    const input = shallow(<TextInput {...defaultProps}/>);

    t.truthy(input.type() === 'input');
});
test('<TextInput/> should add the passed "className" prop to the rendered button if passed.', t => {
    const input = shallow(<TextInput {...defaultProps} className="test"/>);

    t.truthy(input.hasClass('test'));
});
test('<TextInput/> should call the passed "onFocus" prop when focusing the button.', t => {
    const spy = sinon.spy();
    const input = shallow(<TextInput {...defaultProps} onFocus={spy} />);

    input.simulate('focus');

    t.truthy(spy.callCount === 1);
});
test('<TextInput/> should call the passed "onChange" prop with the value of the input when changing it.', t => {
    const spy = sinon.spy();
    const input = shallow(<TextInput {...defaultProps} onChange={spy} />);

    input.simulate('change', {
        target: {
            value: 'my value'
        }
    });

    t.truthy(spy.callCount === 1);
    t.truthy(spy.args[0][0] === 'my value');
});
test('<TextInput/> should throw no error if no "onChange" prop was passed when changing the value of the input.', t => {
    const input = shallow(<TextInput {...defaultProps}/>);
    const fn = () => {
        input.simulate('change', {
            target: {
                value: 'my value'
            }
        });
    };

    t.notThrows(fn);
});
test('<TextInput/> should call the passed "onBlur" prop when leaving the focused state of the input.', t => {
    const spy = sinon.spy();
    const input = shallow(<TextInput {...defaultProps} onBlur={spy} />);

    input.simulate('blur');

    t.truthy(spy.callCount === 1);
});
