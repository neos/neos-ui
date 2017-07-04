import {createShallowRenderer} from './../_lib/testUtils.js';
import {DropDownWrapper} from './wrapper.js';

const defaultProps = {
    children: 'Foo children',
    theme: {}
};
const shallow = createShallowRenderer(DropDownWrapper, defaultProps);

test('should initially have a falsy "isOpen" state value.', () => {
    const dd = shallow();

    expect(dd.state('isOpen')).toBeFalsy();
});
test('should render the "className" prop if passed.', () => {
    const dd = shallow({
        className: 'barClassName'
    });

    expect(dd.hasClass('barClassName')).toBeTruthy();
});
test('should set the "isOpen" state value to opposite when calling the toggle method.', () => {
    const dd = shallow();

    dd.instance().handleToggle();

    expect(dd.state('isOpen')).toBeTruthy();

    dd.instance().handleToggle();

    expect(dd.state('isOpen')).toBeFalsy();
});
test('should set the "isOpen" state value to false when calling the close method.', () => {
    const dd = shallow();

    dd.instance().handleClose();

    expect(dd.state('isOpen')).toBeFalsy();
});
