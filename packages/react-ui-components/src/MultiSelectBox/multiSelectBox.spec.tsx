/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils';
import MultiSelectBox from './multiSelectBox';

describe('<MultiSelectBox/>', () => {
    let props;

    beforeEach(() => {
        props = {
            onValuesChange: jest.fn(),
            onCreateNew: jest.fn(),
            theme: {},
            values: [],
            SelectBox: createStubComponent(),
            IconComponent: createStubComponent(),
            IconButtonComponent: createStubComponent(),
            MultiSelectBox_ListPreviewSortable: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<MultiSelectBox {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
