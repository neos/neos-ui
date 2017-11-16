import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Frame from './frame.js';

describe('<Frame/>', () => {
    let props;

    beforeEach(() => {
        props = {
            mountTarget: 'foo',
            children: 'Foo children',
            contentDidUpdate: jest.fn()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Frame {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Frame {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<Frame {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });
});
