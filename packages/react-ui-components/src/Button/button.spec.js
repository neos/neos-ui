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
    children: 'Foo children',
    onClick: () => null,
    style: 'clean',
    hoverStyle: 'clean'
};
const shallow = createShallowRenderer(Button, defaultProps);

test('should render a "button" node with the role="button" attribute.', t => {
    const btn = shallow();

    t.is(btn.type(), 'button');
});
test('should always render the "brand" and "brandHover" theme classNames in case the "isActive" prop is truthy.', t => {
    const btn = shallow({
        isActive: true
    });

    t.falsy(btn.hasClass(defaultProps.theme['btn--clean']));
    t.falsy(btn.hasClass(defaultProps.theme['btn--cleanHover']));
    t.truthy(btn.hasClass(defaultProps.theme['btn--brand']));
    t.truthy(btn.hasClass(defaultProps.theme['btn--brandHover']));
});
test('should render the "style" and "hoverStyle" theme classNames in case the "isActive" prop is falsy.', t => {
    const btn = shallow({
        isActive: false
    });

    t.truthy(btn.hasClass(defaultProps.theme['btn--clean']));
    t.truthy(btn.hasClass(defaultProps.theme['btn--cleanHover']));
    t.falsy(btn.hasClass(defaultProps.theme['btn--brand']));
    t.falsy(btn.hasClass(defaultProps.theme['btn--brandHover']));
});
test('should render the "className" prop if passed.', t => {
    const btn = shallow({
        className: 'barClassName'
    });

    t.truthy(btn.hasClass('barClassName'));
});
test('should not render the disabled attribute when passing a falsy "isDisabled" prop.', t => {
    const btn = shallow({
        isDisabled: false
    });

    t.falsy(btn.html().includes('disabled=""'));
});
test('should render the disabled attribute when passing a truthy "isDisabled" prop.', t => {
    const btn = shallow({
        isDisabled: true
    });

    t.truthy(btn.html().includes('disabled=""'));
});
test('should call the "_refHandler" prop with the current "isFocused" prop when rendering the node.', t => {
    const props = {
        _refHandler: sinon.spy(),
        isFocused: 'foo'
    };
    shallow(props);

    t.truthy(props._refHandler.calledOnce);
    t.is(props._refHandler.args[0][0], 'foo');
});
test('should propagate the rest of the passed props to the wrapping node.', t => {
    const btn = shallow({
        id: 'fooId'
    });

    t.truthy(btn.html().includes('id="fooId"'));
});
