/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import SelectBox_Option_SingleLine from './SelectBox_Option_SingleLine.js';

describe('<SelectBox_Option_SingleLine/>', () => {
    let props;

    beforeEach(() => {
        props = {
            label: 'Foo label',
            option: {},
            onClick: jest.fn(),
            theme: {},
            IconComponent: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<SelectBox_Option_SingleLine {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
