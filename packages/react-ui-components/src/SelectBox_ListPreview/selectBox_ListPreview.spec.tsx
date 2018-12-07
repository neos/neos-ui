import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SelectBox_ListPreview, {SelectBox_ListPreview_Props} from './selectBox_ListPreview';
import {SelectBoxOptions, SelectBoxOption} from '../SelectBox/selectBox';

describe('SelectBox_ListPreview', () => {
    const props: SelectBox_ListPreview_Props = {
        options: [],
        onChange: jest.fn(),
        searchTermLeftToType: 2,
        searchBoxLeftToTypeLabel: 'left to type',
        noMatchesFoundLabel: 'no matches',
        theme: {
            'selectBox__item': 'selectBox__item-ThemeClassName',
            'selectBox__item--isGroup': 'selectBox__item--isGroup-ThemeClassName',
            'selectBox__groupHeader': 'selectBox__groupHeader-ThemeClassName',
        },
        withoutGroupLabel: 'ungrouped',
        optionValueField: 'testValue',
        onSearchTermChange: jest.fn(),
        onCreateNew: jest.fn(),
        createNewLabel: 'create new',
        onOptionFocus: jest.fn(),
        displayLoadingIndicator: false,
        displaySearchBox: false,
        keydown: {},
        onSearchTermKeyPress: jest.fn(),
        onValueChange: jest.fn(),
        optionValueAccessor: jest.fn(),
        placeholder: 'placeholder',
        threshold: 2,
    };

    it('should render correctly empty.', () => {
        const wrapper = shallow(<SelectBox_ListPreview {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with grouped options.', () => {
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

        const wrapper = shallow(<SelectBox_ListPreview {...props} options={options} />);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with ungrouped options.', () => {
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

        const wrapper = shallow(<SelectBox_ListPreview {...props} options={options} optionValueAccessor={optionValueAccessor}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
