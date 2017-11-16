import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import ComplexOption from './complexOption.js';

describe('<ComplexOption/>', () => {
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
        const wrapper = shallow(<ComplexOption {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
