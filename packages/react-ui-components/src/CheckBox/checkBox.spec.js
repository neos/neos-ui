import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import CheckBox from './checkBox.js';

const defaultProps = {
    isChecked: false,
    theme: {}
};
const shallow = createShallowRenderer(CheckBox, defaultProps);

test('should render a "input" node with the role="button" attribute.', () => {
    const input = shallow().find('[type="checkbox"]');

    expect(input.length).toBe(1);
});
test('should render the "className" prop if passed.', () => {
    const input = shallow({
        className: 'barClassName'
    });

    expect(input.hasClass('barClassName')).toBeTruthy();
});
test('should throw no errors if no "onChange" prop was passed when clicking on the hidden checkbox.', () => {
    const cb = shallow();
    const fn = () => cb.find('[type="checkbox"]').simulate('change');

    expect(fn).not.toThrow();
});
test('should call the passed "onChange" prop when clicking on the hidden checkbox.', () => {
    const onChange = sinon.spy();
    const cb = shallow({onChange});

    cb.find('[type="checkbox"]').simulate('change');

    expect(onChange.callCount).toBe(1);
});
test('should set truthy aria and checked attribute when passing a truthy "isChecked" prop.', () => {
    const markup = shallow({isChecked: true}).find('[type="checkbox"]').html();

    expect(markup.includes('checked="true"')).toBeTruthy();
    expect(markup.includes('aria-checked="true"')).toBeTruthy();
});
test('should set falsy aria and checked attribute when passing a falsy "isChecked" prop.', () => {
    const markup = shallow({isChecked: false}).find('[type="checkbox"]').html();

    expect(markup.includes('checked="false"')).toBeTruthy();
    expect(markup.includes('aria-checked="false"')).toBeTruthy();
});
