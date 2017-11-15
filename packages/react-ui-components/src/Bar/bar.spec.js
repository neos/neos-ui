import {createShallowRenderer} from './../_lib/testUtils.js';
import Bar from './bar.js';

const defaultProps = {
    theme: {},
    children: 'Foo children',
    position: 'top'
};
const shallow = createShallowRenderer(Bar, defaultProps);

test('should render the passed "className" prop to the rendered wrapper if passed.', () => {
    const bar = shallow({className: 'test'});

    expect(bar.hasClass('test')).toBeTruthy();
});
test('should render the passed "children".', () => {
    const bar = shallow();

    expect(bar.html().includes('Foo children')).toBeTruthy();
});
test('should propagate the rest of the passed props to the wrapping node.', () => {
    const props = {onDrop: jest.fn()};
    const bar = shallow(props);

    bar.simulate('drop');

    expect(props.onDrop.mock.calls.length).toBe(1);
});
