import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import MultiSelectBox from './multiSelectBox.js';

describe('<MultiSelectBox/>', () => {
    let props;

    beforeEach(() => {
        props = {
            onValuesChange: jest.fn(),
            theme: {},
            values: [],
            SelectBoxComponent: createStubComponent(),
            IconComponent: createStubComponent(),
            IconButtonComponent: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<MultiSelectBox {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
