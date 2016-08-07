import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import TextInput from './textInput.js';

const defaultProps = {
    theme: {}
};
const shallow = createShallowRenderer(TextInput, defaultProps);

test('should render an "input" node.', t => {
    const input = shallow();

    t.is(input.type(), 'input');
});
test('should add the passed "className" prop to the rendered button if passed.', t => {
    const input = shallow({className: 'testClassName'});

    t.truthy(input.hasClass('testClassName'));
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
test('should throw no error if no "onChange" prop was passed when changing the value of the input.', t => {
    const input = shallow();
    const fn = () => {
        input.simulate('change', {
            target: {
                value: 'my value'
            }
        });
    };

    t.notThrows(fn);
});
