import sinon from 'sinon';
import moment from 'moment';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import {DateInput} from './dateInput.js';

const defaultProps = {
    onChange: () => null,
    IconComponent: createStubComponent(),
    DatePickerComponent: createStubComponent(),
    ButtonComponent: createStubComponent(),
    CollapseComponent: createStubComponent(),
    theme: {
        'dropDown__contents': 'baseDropDownContentsClassName',
        'dropDown__contents--isOpen': 'openDropDownContentsClassName'
    }
};
const shallow = createShallowRenderer(DateInput, defaultProps);

test('should initialize with a state of {isOpen = false}.', () => {
    const wrapper = shallow();

    expect(wrapper.state('isOpen')).toBe(false);
});
test('should render 3 buttons.', () => {
    const wrapper = shallow();
    const btns = wrapper.find('button');

    expect(btns.length).toBe(3);
});
test('should render an calendar icon within the first button.', () => {
    const wrapper = shallow();
    const btn = wrapper.find('button').at(0);

    expect(btn.find(defaultProps.IconComponent).length).toBe(1);
    expect(btn.find(defaultProps.IconComponent).prop('icon')).toBe('calendar');
});
test('should set the "isOpen" state to a truthy value when clicking on the first button.', () => {
    const wrapper = shallow();
    const btn = wrapper.find('button').at(0);

    btn.simulate('click');

    expect(wrapper.state('isOpen')).toBe(true);
});
test('should render a input[type="datetime"].', () => {
    const wrapper = shallow();
    const input = wrapper.find('input[type="datetime"]');

    input.simulate('focus');

    expect(input.length).toBe(1);
    expect(wrapper.state('isOpen')).toBe(true);
});
test('should render an remove icon within the second button.', () => {
    const wrapper = shallow();
    const btn = wrapper.find('button').at(1);

    expect(btn.find(defaultProps.IconComponent).length).toBe(1);
    expect(btn.find(defaultProps.IconComponent).prop('icon')).toBe('remove');
});
test('should set the "isOpen" state to a falsy value and call the "onChange" prop with `null` when clicking on the second button.', () => {
    const onChange = sinon.spy();
    const wrapper = shallow({onChange});
    const btn = wrapper.find('button').at(1);

    wrapper.setState({isOpen: true});
    btn.simulate('click');

    expect(wrapper.state('isOpen')).toBe(false);
    expect(onChange.callCount).toBe(1);
    expect(onChange.args[0][0]).toBe(null);
});
test('should render a "Collapse" Component which is opened depending on the "isOpen" state.', () => {
    const wrapper = shallow();
    const collapse = wrapper.find(defaultProps.CollapseComponent);

    expect(collapse.length).toBe(1);
    expect(collapse.prop('isOpened')).toBe(wrapper.state('isOpen'));
});
test('should render a "DatePicker" Component.', () => {
    const value = new Date();
    const wrapper = shallow({value});
    const picker = wrapper.find(defaultProps.DatePickerComponent);

    expect(picker.length).toBe(1);
    expect(picker.prop('open')).toBe(true);
    expect(picker.prop('defaultValue')).toBe(value);
});
test('should call the "onChange" prop when triggering the change event on the "DatePicker" Component and clicking apply.', () => {
    const onChange = sinon.spy();
    const value = new Date();
    const wrapper = shallow({value, onChange});
    const picker = wrapper.find(defaultProps.DatePickerComponent);
    const applyButton = wrapper.find(defaultProps.ButtonComponent);
    const newVal = moment();

    picker.simulate('change', newVal);
    applyButton.simulate('click');

    expect(onChange.callCount).toBe(1);
    expect(onChange.args[0][0].toTimeString()).toBe(newVal.toDate().toTimeString());
});
test('should set the "isOpen" state to a falsy value and call the "onChange" prop with todays date when clicking on the third button.', () => {
    const onChange = sinon.spy();
    const wrapper = shallow({onChange});
    const btn = wrapper.find('button').at(2);
    const date = new Date();

    wrapper.setState({isOpen: true});
    btn.simulate('click');

    expect(wrapper.state('isOpen')).toBe(false);
    expect(onChange.callCount).toBe(1);
    console.log(onChange.args[0][0].toTimeString());
    expect(onChange.args[0][0].toTimeString()).toBe(date.toTimeString());
});
