import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import moment from 'moment';
import {createStubComponent} from './../_lib/testUtils.js';
import {DateInput} from './dateInput.js';

describe('<DateInput/>', () => {
    let props;

    beforeEach(() => {
        props = {
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
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<DateInput {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should initialize with a state of {isOpen = false}.', () => {
        const wrapper = shallow(<DateInput {...props}/>);

        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('should set the "isOpen" state to a truthy value when clicking on the first button.', () => {
        const wrapper = shallow(<DateInput {...props}/>);
        const btn = wrapper.find('button').at(0);

        btn.simulate('click');

        expect(wrapper.state('isOpen')).toBe(true);
    });

    it('should set the "isOpen" state to a falsy value and call the "onChange" prop with `null` when clicking on the second button.', () => {
        const onChange = jest.fn();
        const wrapper = shallow(<DateInput {...props} onChange={onChange}/>);
        const btn = wrapper.find('button').at(1);

        wrapper.setState({isOpen: true});
        btn.simulate('click');

        expect(wrapper.state('isOpen')).toBe(false);
        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe(null);
    });

    it('should call the "onChange" prop when triggering the change event on the "DatePicker" Component and clicking apply.', () => {
        const onChange = jest.fn();
        const value = new Date();
        const wrapper = shallow(<DateInput {...props} value={value} onChange={onChange}/>);
        const picker = wrapper.find(props.DatePickerComponent);
        const applyButton = wrapper.find(props.ButtonComponent);
        const newVal = moment();

        picker.simulate('change', newVal);
        applyButton.simulate('click');

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].toTimeString()).toBe(newVal.toDate().toTimeString());
    });

    it('should set the "isOpen" state to a falsy value and call the "onChange" prop with todays date when clicking on the third button.', () => {
        const onChange = jest.fn();
        const wrapper = shallow(<DateInput {...props} onChange={onChange}/>);
        const btn = wrapper.find('button').at(2);
        const date = new Date();

        wrapper.setState({isOpen: true});
        btn.simulate('click');

        expect(wrapper.state('isOpen')).toBe(false);
        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].toTimeString()).toBe(date.toTimeString());
    });
});
