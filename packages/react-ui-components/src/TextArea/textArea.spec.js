import TextareaAutoresize from 'react-textarea-autosize';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import {undecorated} from './textArea.js';

const TooltipComponent = createStubComponent();
const defaultProps = {
    theme: {},
    TooltipComponent
};
const shallow = createShallowRenderer(undecorated, defaultProps);

test('should render a "TextareaAutoresize" component.', () => {
    const input = shallow().find(TextareaAutoresize);

    expect(input.length).toBe(1);
});
test('should call the passed "onChange" prop with the value of the input when changing it.', () => {
    const onChange = jest.fn();
    const input = shallow({onChange}).find(TextareaAutoresize);

    input.simulate('change', {
        target: {
            value: 'my value'
        }
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe('my value');
});
