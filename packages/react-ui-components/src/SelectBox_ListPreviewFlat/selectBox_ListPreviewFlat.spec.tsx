import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SelectBox_ListPreviewFlat, {SelectBox_ListPreviewFlat_Props} from './selectBox_ListPreviewFlat';
import {SelectBoxOptions, SelectBoxOption} from '../SelectBox/selectBox';

describe('SelectBox_ListPreviewFlat', () => {
    const props: SelectBox_ListPreviewFlat_Props = {
        onChange: jest.fn(),
        onOptionFocus: jest.fn(),
        optionValueAccessor: jest.fn(),
        options: [],
        theme: {
            selectBox__item: 'selectBox__itemClassName',
        },
    };

    it('should render correctly empty.', () => {
        const wrapper = shallow(<SelectBox_ListPreviewFlat {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with options.', () => {
        const options: SelectBoxOptions = [
            {
                label: 'option1',
                testValue: 'value1',
            },
            {
                label: 'option2',
                testValue: 'value2',
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

        const wrapper = shallow(<SelectBox_ListPreviewFlat {...props} options={options} optionValueAccessor={optionValueAccessor}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
