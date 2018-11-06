/* eslint-disable camelcase, react/jsx-pascal-case */
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SelectBox_Option_SingleLine, {SelectBox_Option_SingleLineProps} from './selectBox_Option_SingleLine';

describe('<SelectBox_Option_SingleLine/>', () => {
    const props: SelectBox_Option_SingleLineProps = {
        children: 'Foo children',
        onClick: jest.fn(),
        option: {
            label: 'Foo label'
        },
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<SelectBox_Option_SingleLine {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
