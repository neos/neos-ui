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
                'wrapper--highlight': 'wrapperHighlightClassName',
                'selectedOptions': 'selectedOptionsClassName',
                'selectedOptions__item': 'selectedOptionsItemClassName'
            },
            onValueChange: jest.fn(),
            options: [],
            DropDownComponent: createStubComponent(),
            IconComponent: createStubComponent(),
            IconButtonComponent: createStubComponent(),
            TextInputComponent: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<SelectBox {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
