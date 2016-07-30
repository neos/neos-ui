import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Bar from './bar.js';

const defaultProps = {
    theme: {},
    children: 'Foo children'
};
const shallow = createShallowRenderer(Bar, defaultProps);

test('should render the passed "className" prop to the rendered wrapper if passed.', t => {
    const props = {className: 'test', position: 'top'};
    const bar = shallow(props);

    t.truthy(bar.hasClass('test'));
});

test('should call the passed "onDrop" prop when clicking the button.', t => {
    const props = {onDrop: sinon.spy(), position: 'top'};
    const bar = shallow(props);

    bar.simulate('drop');

    t.truthy(props.onDrop.calledOnce);
});
