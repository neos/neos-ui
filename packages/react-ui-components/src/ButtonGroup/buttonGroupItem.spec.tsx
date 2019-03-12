import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import ButtonGroupItem, {ButtonGroupItemProps} from './buttonGroupItem';

describe('<ButtonGroupItem/>', () => {
    const props: ButtonGroupItemProps = {
        element: <div id="foo">Foo button</div>,
        id: 'foo',
        onClick: jest.fn(),
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<ButtonGroupItem {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ButtonGroupItem {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });
});
