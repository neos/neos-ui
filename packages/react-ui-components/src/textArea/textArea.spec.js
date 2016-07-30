import test from 'ava';
import sinon from 'sinon';
import TextareaAutoresize from 'react-textarea-autosize';
import {createShallowRenderer} from './../_lib/testUtils.js';

import TextArea from './textArea.js';

const defaultProps = {
    theme: {}
};
const shallow = createShallowRenderer(TextArea, defaultProps);

test('<TextArea/> should render a "TextareaAutoresize" component.', t => {
    const input = shallow().find(TextareaAutoresize);

    t.truthy(input.length === 1);
});
test('<TextArea/> should call the passed "onFocus" prop when focusing the button.', t => {
    const onFocus = sinon.spy();
    const input = shallow({onFocus});

    input.simulate('focus');

    t.truthy(onFocus.callCount === 1);
});
test('<TextArea/> should call the passed "onChange" prop with the value of the input when changing it.', t => {
    const onChange = sinon.spy();
    const input = shallow({onChange});

    input.simulate('change', {
        target: {
            value: 'my value'
        }
    });

    t.truthy(onChange.callCount === 1);
    t.truthy(onChange.args[0][0] === 'my value');
});
test('<TextArea/> should call the passed "onBlur" prop when leaving the focused state of the input.', t => {
    const onBlur = sinon.spy();
    const input = shallow({onBlur});

    input.simulate('blur');

    t.truthy(onBlur.callCount === 1);
});
