import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import moment from 'moment';
import DatePicker from 'react-datetime';

import Button from '../Button';
import {DateInput} from './dateInput';

describe('<DateInput/>', () => {
    const props: DateInput['props'] = {
        onChange: jest.fn(),
        locale: 'en-US',
        applyLabel: 'applyLabel',
        todayLabel: 'todayLabel',
        theme: {
            'wrapper': 'wrapperClassName',
            'disabled': 'disabledClassName',
            'disabled-cursor': 'disabledClassName',
            'calendarInputWrapper': 'calendarInputWrapperClassName',
            'calendarIconBtn': 'calendarIconBtnClassName',
            'calendarFakeInputWrapper': 'calendarFakeInputWrapperClassName',
            'calendarFakeInputMirror': 'calendarFakeInputMirrorClassName',
            'calendarFakeInput': 'calendarFakeInputClassName',
            'applyBtn': 'applyBtnClassName',
            'closeCalendarIconBtn': 'closeCalendarIconBtnClassName',
            'selectTodayBtn': 'selectTodayBtnClassName',
        }
    };

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
        const wrapper = shallow(<DateInput {...props} value={new Date()} onChange={onChange}/>);
        const picker = wrapper.find(DatePicker);
        const applyButton = wrapper.find(Button);
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

    it('should set "utc" on DatePickerComponent if "dateOnly" prop is set.', () => {
        const wrapper = shallow(<DateInput {...props} dateOnly={true}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call "onChange" with beginning of day in UTC for todays date if "dateOnly" is set.', () => {
        const onChange = jest.fn();
        const wrapper = shallow(<DateInput {...props} dateOnly={true} onChange={onChange}/>);
        const btn = wrapper.find('button').at(2);
        const date = new Date();

        wrapper.setState({isOpen: true});
        btn.simulate('click');

        expect(onChange.mock.calls.length).toBe(1);

        const receivedDate = onChange.mock.calls[0][0];
        expect(receivedDate.getUTCDate()).toBe(date.getDate());
        expect(receivedDate.getUTCMonth()).toBe(date.getMonth());
        expect(receivedDate.getUTCFullYear()).toBe(date.getFullYear());
        expect(receivedDate.getUTCHours()).toBe(0);
        expect(receivedDate.getUTCMinutes()).toBe(0);
        expect(receivedDate.getUTCSeconds()).toBe(0);
        expect(receivedDate.getUTCMilliseconds()).toBe(0);
    });
});
