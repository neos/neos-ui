/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import MultiSelectBox, {MultiSelectBoxProps, defaultProps} from './multiSelectBox';

describe('<MultiSelectBox/>', () => {
    const props: MultiSelectBoxProps = {
        ...defaultProps,
        options: [],
        createNewLabel: 'create new label',
        displayLoadingIndicator: false,
        displaySearchBox: false,
        scrollable: true,
        searchTerm: '',
        setFocus: true,
        onSearchTermChange: jest.fn(),
        onValuesChange: jest.fn(),
        onCreateNew: jest.fn(),
        values: [],
        theme: {
            selectedOptions: 'selectedOptionsClassName',
            selectedOptions__item: 'selectedOptions__itemClassName',
            wrapper: 'wrapperClassName',
        },
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<MultiSelectBox {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
