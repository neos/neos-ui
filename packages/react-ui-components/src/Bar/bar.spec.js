import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Bar from './bar.js';

const defaultProps = {
    theme: {},
    children: 'Foo children',
    position: 'top'
};
const shallow = createShallowRenderer(Bar, defaultProps);

test('should render the passed "className" prop to the rendered wrapper if passed.', t => {
    const bar = shallow({className: 'test'});

    t.truthy(bar.hasClass('test'));
});
test('should render the passed "children".', t => {
    const bar = shallow();

    t.truthy(bar.html().includes('Foo children'));
});
test('should propagate the rest of the passed props to the wrapping node.', t => {
    const props = {onDrop: sinon.spy()};
    const bar = shallow(props);

    bar.simulate('drop');

    t.truthy(props.onDrop.calledOnce);
});
