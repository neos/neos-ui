/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import SelectBox from './selectBox.js';

describe('<SelectBox/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                'wrapper': 'wrapperClassName',
                'wrapper--highlight': 'wrapperHighlightClassName'
            },
            onValueChange: jest.fn(),
            options: [],
            DropDown: createStubComponent(),
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
