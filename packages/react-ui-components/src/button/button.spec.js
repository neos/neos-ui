import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Button from './button.js';

const defaultProps = {
    theme: {},
    className: 'foo className',
    children: 'Foo children'
};
const shallow = createShallowRenderer(Button, defaultProps);

test('should render a "button" node with the role="button" attribute.', t => {
    const props = {
        onClick: sinon.spy(),
        style: 'clean'
    };
    const btn = shallow(props);

    t.truthy(btn.type() === 'button');
});
test('should render a "button" and respect the "className" prop if passed.', t => {
    const props = {
        onClick: sinon.spy(),
        style: 'clean',
        className: 'bar className'
    };
    const btn = shallow(props);

    t.truthy(btn.html().includes('class="bar className"'));
});
test('should render the disabled attribute when passing a truthy "isDisabled" prop.', t => {
    const props = {
        onClick: sinon.spy(),
        isDisabled: true,
        style: 'clean'
    };
    const btn = shallow(props);

    t.truthy(btn.html().includes('disabled=""'));
});
