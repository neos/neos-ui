import test from 'ava';
import sinon from 'sinon';
import moment from 'moment';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import {DateInput} from './dateInput.js';

const defaultProps = {
    onChange: () => null,
    IconComponent: createStubComponent(),
    DatePickerComponent: createStubComponent(),
    CollapseComponent: createStubComponent(),
    theme: {
        'dropDown__contents': 'baseDropDownContentsClassName',
        'dropDown__contents--isOpen': 'openDropDownContentsClassName'
    }
};
const shallow = createShallowRenderer(DateInput, defaultProps);

test('should initialize with a state of {isOpen = false}.', t => {
    const wrapper = shallow();

    t.is(wrapper.state('isOpen'), false);
});
test('should render 3 buttons.', t => {
    const wrapper = shallow();
    const btns = wrapper.find('button');

    t.is(btns.length, 3);
});
test('should render an calendar icon within the first button.', t => {
    const wrapper = shallow();
    const btn = wrapper.find('button').at(0);

    t.is(btn.find(defaultProps.IconComponent).length, 1);
    t.is(btn.find(defaultProps.IconComponent).prop('icon'), 'calendar');
});
test('should set the "isOpen" state to a truthy value when clicking on the first button.', t => {
    const wrapper = shallow();
    const btn = wrapper.find('button').at(0);

    btn.simulate('click');

    t.is(wrapper.state('isOpen'), true);
});
test('should render a input[type="datetime"].', t => {
    const wrapper = shallow();
    const input = wrapper.find('input[type="datetime"]');

    input.simulate('focus');

    t.is(input.length, 1);
    t.is(wrapper.state('isOpen'), true);
});
test('should render an remove icon within the second button.', t => {
    const wrapper = shallow();
    const btn = wrapper.find('button').at(1);

    t.is(btn.find(defaultProps.IconComponent).length, 1);
    t.is(btn.find(defaultProps.IconComponent).prop('icon'), 'remove');
});
test('should set the "isOpen" state to a falsy value and call the "onChange" prop with `null` when clicking on the second button.', t => {
    const onChange = sinon.spy();
    const wrapper = shallow({onChange});
    const btn = wrapper.find('button').at(1);

    wrapper.setState({isOpen: true});
    btn.simulate('click');

    t.is(wrapper.state('isOpen'), false);
    t.is(onChange.callCount, 1);
    t.is(onChange.args[0][0], null);
});
test('should render a "Collapse" Component which is opened depending on the "isOpen" state.', t => {
    const wrapper = shallow();
    const collapse = wrapper.find(defaultProps.CollapseComponent);

    t.is(collapse.length, 1);
    t.is(collapse.prop('isOpened'), wrapper.state('isOpen'));
});
test('should render a "DatePicker" Component.', t => {
    const value = new Date();
    const wrapper = shallow({value});
    const picker = wrapper.find(defaultProps.DatePickerComponent);

    t.is(picker.length, 1);
    t.is(picker.prop('open'), true);
    t.is(picker.prop('value'), value);
});
test('should call the "onChange" prop when triggering the change event on the "DatePicker" Component.', t => {
    const onChange = sinon.spy();
    const value = new Date();
    const wrapper = shallow({value, onChange});
    const picker = wrapper.find(defaultProps.DatePickerComponent);
    const newVal = moment();

    picker.simulate('change', newVal);

    t.is(onChange.callCount, 1);
    t.is(onChange.args[0][0].toTimeString(), newVal.toDate().toTimeString());
});
test('should set the "isOpen" state to a falsy value and call the "onChange" prop with todays date when clicking on the third button.', t => {
    const onChange = sinon.spy();
    const wrapper = shallow({onChange});
    const btn = wrapper.find('button').at(2);
    const date = new Date();

    wrapper.setState({isOpen: true});
    btn.simulate('click');

    t.is(wrapper.state('isOpen'), false);
    t.is(onChange.callCount, 1);
    t.is(onChange.args[0][0].toTimeString(), date.toTimeString());
});
