import test from 'ava';
import sinon from 'sinon';
import TextareaAutoresize from 'react-textarea-autosize';
import {createShallowRenderer} from './../_lib/testUtils.js';

import TextArea from './textArea.js';

const defaultProps = {
    theme: {}
};
const shallow = createShallowRenderer(TextArea, defaultProps);

test('should render a "TextareaAutoresize" component.', t => {
    const input = shallow().find(TextareaAutoresize);

    t.is(input.length, 1);
});
test('should call the passed "onChange" prop with the value of the input when changing it.', t => {
    const onChange = sinon.spy();
    const input = shallow({onChange});

    input.simulate('change', {
        target: {
            value: 'my value'
        }
    });

    t.is(onChange.callCount, 1);
    t.is(onChange.args[0][0], 'my value');
});
