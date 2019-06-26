/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils';
import SelectBox from './selectBox';

describe('<SelectBox/>', () => {
    let props;

    beforeEach(() => {
        const DropDown = createStubComponent();
        DropDown.Stateless = createStubComponent();
        DropDown.Header = createStubComponent();
        DropDown.Contents = createStubComponent();
        props = {
            theme: {
                'wrapper': 'wrapperClassName',
                'wrapper--highlight': 'wrapperHighlightClassName',
                'selectBoxHeader': 'selectBoxHeaderClassName'
            },
            searchBoxLeftToTypeLabel: 'searchBoxLeftToTypeLabel',
            noMatchesFoundLabel: 'noMatchesFoundLabel',
            placeholder: 'placeholder',
            placeholderIcon: 'placeholderIcon',
            onValueChange: jest.fn(),
            options: [],
            DropDown,
            SelectBox_Header: createStubComponent(),
            SelectBox_HeaderWithSearchInput: createStubComponent(),
            SelectBox_ListPreview: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<SelectBox {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
