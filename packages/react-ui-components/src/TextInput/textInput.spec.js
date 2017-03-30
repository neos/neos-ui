import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import TextInput from './textInput.js';

const defaultProps = {
    theme: {}
};
const shallow = createShallowRenderer(TextInput, defaultProps);

test('should render an "input" node.', () => {
    const input = shallow().find('input');

    expect(input.type()).toBe('input');
});
test('should add the passed "className" prop to the rendered button if passed.', () => {
    const input = shallow({className: 'testClassName'}).find('input');

    expect(input.hasClass('testClassName')).toBeTruthy();
});
test('should call the passed "onChange" prop with the value of the input when changing it.', () => {
    const onChange = sinon.spy();
    const input = shallow({onChange}).find('input');

    input.simulate('change', {
        target: {
            value: 'my value'
        }
    });

    expect(onChange.callCount).toBe(1);
    expect(onChange.args[0][0]).toBe('my value');
});
test('should throw no error if no "onChange" prop was passed when changing the value of the input.', () => {
    const input = shallow().find('input');
    const fn = () => {
        input.simulate('change', {
            target: {
                value: 'my value'
            }
        });
    };

    expect(fn).not.toThrow();
});
