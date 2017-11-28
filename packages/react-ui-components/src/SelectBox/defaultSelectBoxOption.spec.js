import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import DefaultSelectBoxOption from './defaultSelectBoxOption.js';

describe('<DefaultSelectBoxOption/>', () => {
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
        const wrapper = shallow(<DefaultSelectBoxOption {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
