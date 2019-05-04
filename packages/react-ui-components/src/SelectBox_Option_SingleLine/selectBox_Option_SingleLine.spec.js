/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils';
import SelectBox_Option_SingleLine from './selectBox_Option_SingleLine';

describe('<SelectBox_Option_SingleLine/>', () => {
    let props;

    beforeEach(() => {
        props = {
            label: 'Foo label',
            option: {label: 'Bar label'},
            onClick: jest.fn(),
            theme: {},
            ListPreviewElement: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<SelectBox_Option_SingleLine {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
