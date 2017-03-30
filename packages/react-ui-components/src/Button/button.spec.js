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

test('should render a "button" node with the role="button" attribute.', () => {
    const btn = shallow();

    expect(btn.type()).toBe('button');
});
test('should always render the "brand" and "brandHover" theme classNames in case the "isActive" prop is truthy.', () => {
    const btn = shallow({
        isActive: true
    });

    expect(btn.hasClass(defaultProps.theme['btn--clean'])).toBeFalsy();
    expect(btn.hasClass(defaultProps.theme['btn--cleanHover'])).toBeFalsy();
    expect(btn.hasClass(defaultProps.theme['btn--brand'])).toBeTruthy();
    expect(btn.hasClass(defaultProps.theme['btn--brandHover'])).toBeTruthy();
});
test('should render the "style" and "hoverStyle" theme classNames in case the "isActive" prop is falsy.', () => {
    const btn = shallow({
        isActive: false
    });

    expect(btn.hasClass(defaultProps.theme['btn--clean'])).toBeTruthy();
    expect(btn.hasClass(defaultProps.theme['btn--cleanHover'])).toBeTruthy();
    expect(btn.hasClass(defaultProps.theme['btn--brand'])).toBeFalsy();
    expect(btn.hasClass(defaultProps.theme['btn--brandHover'])).toBeFalsy();
});
test('should render the "className" prop if passed.', () => {
    const btn = shallow({
        className: 'barClassName'
    });

    expect(btn.hasClass('barClassName')).toBeTruthy();
});
test('should not render the disabled attribute when passing a falsy "isDisabled" prop.', () => {
    const btn = shallow({
        isDisabled: false
    });

    expect(btn.html().includes('disabled=""')).toBeFalsy();
});
test('should render the disabled attribute when passing a truthy "isDisabled" prop.', () => {
    const btn = shallow({
        isDisabled: true
    });

    expect(btn.html().includes('disabled=""')).toBeTruthy();
});
test('should call the "_refHandler" prop with the current "isFocused" prop when rendering the node.', () => {
    const props = {
        _refHandler: sinon.spy(),
        isFocused: 'foo'
    };
    shallow(props);

    expect(props._refHandler.calledOnce).toBeTruthy();
    expect(props._refHandler.args[0][0]).toBe('foo');
});
test('should propagate the rest of the passed props to the wrapping node.', () => {
    const btn = shallow({
        id: 'fooId'
    });

    expect(btn.html().includes('id="fooId"')).toBeTruthy();
});
