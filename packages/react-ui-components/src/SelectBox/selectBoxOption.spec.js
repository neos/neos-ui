import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils.js';
import SelectBoxOption from './selectBoxOption.js';

describe('<SelectBoxOption/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                'selectBox__item': 'itemClassName',
                'selectBox__item--isSelectable': 'itemSelectedClassName',
                'selectBox__itemIcon': 'itemIconClassName'
            },
            onClick: jest.fn(),
            children: <div>Foo</div>,
            IconComponent: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<SelectBoxOption {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
