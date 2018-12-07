import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SelectBox_ListPreviewGrouped, {SelectBox_ListPreviewGrouped_Props} from './selectBox_ListPreviewGrouped';
import {SelectBoxOptions, SelectBoxOption} from '../SelectBox/selectBox';

describe('SelectBox_ListPreviewGrouped', () => {
    const props: SelectBox_ListPreviewGrouped_Props = {
        onChange: jest.fn(),
        onOptionFocus: jest.fn(),
        optionValueAccessor: jest.fn(),
        options: [],
        withoutGroupLabel: 'ungrouped',
        theme: {
            'selectBox__item': 'selectBox__item-ThemeClassName',
            'selectBox__item--isGroup': 'selectBox__item--isGroup-ThemeClassName',
            'selectBox__groupHeader': 'selectBox__groupHeader-ThemeClassName',
        },
    };

    it('should render correctly empty.', () => {
        const wrapper = shallow(<SelectBox_ListPreviewGrouped {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with options.', () => {
        const options: SelectBoxOptions = [
            {
                label: 'option1',
                testValue: 'value1',
                group: 'grouped',
            },
            {
                label: 'option2',
                testValue: 'value2',
                group: 'grouped',
                icon: 'level-up',
            },
            {
                label: 'option3',
                testValue: 'value3',
                disabled: true,
            },
        ];
        const valueFied = 'testValue';
        const optionValueAccessor = (option: SelectBoxOption) => option[valueFied];

        const wrapper = shallow(<SelectBox_ListPreviewGrouped {...props} options={options} optionValueAccessor={optionValueAccessor}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
