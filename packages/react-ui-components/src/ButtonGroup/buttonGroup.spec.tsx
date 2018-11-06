import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import ButtonGroup, {ButtonGroupProps} from './buttonGroup';

describe('<ButtonGroup/>', () => {
    const props: ButtonGroupProps = {
        children: [
            <div key="foo" id="foo">Foo button</div>,
            <div key="bar" id="bar">Bar button</div>
        ],
        onSelect: jest.fn(),
        theme: {
            buttonGroup: 'buttonGroupClassName',
        },
        value: 'foo',
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<ButtonGroup {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ButtonGroup {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });
});
