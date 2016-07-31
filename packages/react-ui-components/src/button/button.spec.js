import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Button from './button.js';

const defaultProps = {
    theme: {
        'btn--clean': 'cleanClassName',
        'btn--brand': 'brandClassName',
        'btn--cleanHover': 'cleanHoverClassName',
        'btn--brandHover': 'brandHoverClassName'
    },
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

    t.is(btn.type(), 'button');
});
test('should always render the "brand" and "brandHover" theme classNames in case the "isActive" prop is truthy.', t => {
    const props = {
        onClick: sinon.spy(),
        style: 'clean',
        isActive: true
    };
    const btn = shallow(props);

    t.falsy(btn.hasClass(defaultProps.theme['btn--clean']));
    t.falsy(btn.hasClass(defaultProps.theme['btn--cleanHover']));
    t.truthy(btn.hasClass(defaultProps.theme['btn--brand']));
    t.truthy(btn.hasClass(defaultProps.theme['btn--brandHover']));
});
test('should render the "style" and "hoverStyle" theme classNames in case the "isActive" prop is falsy.', t => {
    const props = {
        onClick: sinon.spy(),
        style: 'clean',
        hoverStyle: 'clean',
        isActive: false
    };
    const btn = shallow(props);

    t.truthy(btn.hasClass(defaultProps.theme['btn--clean']));
    t.truthy(btn.hasClass(defaultProps.theme['btn--cleanHover']));
    t.falsy(btn.hasClass(defaultProps.theme['btn--brand']));
    t.falsy(btn.hasClass(defaultProps.theme['btn--brandHover']));
});
test('should render the "className" prop if passed.', t => {
    const props = {
        onClick: sinon.spy(),
        style: 'clean',
        className: 'barClassName'
    };
    const btn = shallow(props);

    t.truthy(btn.hasClass('barClassName'));
});
test('should not render the disabled attribute when passing a falsy "isDisabled" prop.', t => {
    const props = {
        onClick: sinon.spy(),
        isDisabled: false,
        style: 'clean'
    };
    const btn = shallow(props);

    t.falsy(btn.html().includes('disabled=""'));
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
test('should propagate the rest of the passed props to the wrapping node.', t => {
    const props = {
        onClick: sinon.spy(),
        id: 'fooId',
        style: 'clean'
    };
    const btn = shallow(props);

    t.truthy(btn.html().includes('id="fooId"'));
});
