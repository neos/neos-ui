import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import ButtonGroupItem from './buttonGroupItem.js';

describe('<ButtonGroupItem/>', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'foo',
            onClick: jest.fn(),
            element: <div id="foo">Foo button</div>
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<ButtonGroupItem {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ButtonGroupItem {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<ButtonGroupItem {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });
});
