/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import {render, shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import SelectBox, {defaultProps, SelectBoxProps, SelectBoxOptions} from './selectBox';

describe('<SelectBox/>', () => {
    const props: SelectBoxProps = {
        ...defaultProps,
        theme: {
            'selectBox': 'selectBoxClassName',
            'selectBox--disabled': 'selectBox--disabledClassName',
            'selectBox__btn': 'selectBox__btnClassName',
            'selectBox__btn--noRightPadding': 'selectBox__btn--noRightPaddingClassName',
            'selectBox__contents': 'selectBox__contentsClassName',
            'selectBox__list': 'selectBox__listClassName',
            'wrapper': 'wrapperClassName',
            'wrapper--highlight': 'wrapper--highlightClassName',
            'selectBoxHeader': 'selectBoxHeaderClassName',
            'selectBox__item': 'selectBox__itemClassName',
            'selectBox__item--isGroup': 'selectBox__item--isGroupClassName',
            'selectBox__groupHeader': 'selectBox__groupHeaderClassName',
            'selectBoxHeader__icon': 'selectBoxHeader__iconClassName',
            'selectBoxHeader__innerPreview': 'selectBoxHeader__innerPreviewClassName',
            'selectBoxHeader__label': 'selectBoxHeader__labelClassName',
            'selectBoxHeader__seperator': 'selectBoxHeader__seperatorClassName',
            'selectBoxHeader__wrapperIconWrapper': 'selectBoxHeader__wrapperIconWrapperClassName',
            'selectBoxHeaderWithSearchInput': 'selectBoxHeaderWithSearchInputClassName',
            'selectBoxHeaderWithSearchInput__inputContainer': 'selectBoxHeaderWithSearchInput__inputContainerClassName',
            'selectBoxHeaderWithSearchInput__icon': 'selectBoxHeaderWithSearchInput__iconClassName',
            'selectBoxHeaderWithSearchInput__input': 'selectBoxHeaderWithSearchInput__inputClassName',
        },
        options: [],
        placeholder: 'placeholder',
        createNewLabel: 'createNewLabel',
        noMatchesFoundLabel: 'noMatchesFoundLabel',
        searchBoxLeftToTypeLabel: 'searchBoxLeftToTypeLabel',
        loadingLabel: 'loadingLabel',
        displayLoadingIndicator: false,
        displaySearchBox: false,
        onCreateNew: jest.fn(),
        onSearchTermChange: jest.fn(),
        onSearchTermKeyPress: jest.fn(),
        onValueChange: jest.fn(),
        keydown: {},
    };

    it('should render correctly with DropDownToggle', () => {
        const shallowResult = shallow(<SelectBox {...props} showDropDownToggle={true} />);
        const renderResult = render(<SelectBox {...props} showDropDownToggle={true} />);

        expect(toJson(shallowResult)).toMatchSnapshot();
        expect(toJson(renderResult)).toMatchSnapshot();
    });

    it('should render correctly with LoadingIndicator', () => {
        const shallowResult = shallow(<SelectBox {...props} displayLoadingIndicator={true} />);
        const renderResult = render(<SelectBox {...props} displayLoadingIndicator={true} />);

        expect(toJson(shallowResult)).toMatchSnapshot();
        expect(toJson(renderResult)).toMatchSnapshot();
    });

    it('should render correctly with SearchBox', () => {
        const shallowResult = shallow(<SelectBox {...props} displaySearchBox={true} />);
        const renderResult = render(<SelectBox {...props} displaySearchBox={true} />);

        expect(toJson(shallowResult)).toMatchSnapshot();
        expect(toJson(renderResult)).toMatchSnapshot();
    });

    it('should render correctly with no matches found', () => {
        const shallowResult = shallow(<SelectBox {...props} threshold={0} />);
        const renderResult = render(<SelectBox {...props} threshold={0} />);

        expect(toJson(shallowResult)).toMatchSnapshot();
        expect(toJson(renderResult)).toMatchSnapshot();
    });

    it('should render correctly with options', () => {
        const options: SelectBoxOptions = [
            {
                label: 'option 1',
            },
            {
                label: 'option 2',
                disabled: true,
            },
            {
                label: 'option 3',
                icon: 'level-up'
            },
        ];
        const shallowResult = shallow(<SelectBox {...props} options={options} />);
        const renderResult = render(<SelectBox {...props} options={options} />);

        expect(toJson(shallowResult)).toMatchSnapshot();
        expect(toJson(renderResult)).toMatchSnapshot();
    });
});
