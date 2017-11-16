import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Grid from './grid.js';

describe('<Grid/>', () => {
    let props;

    beforeEach(() => {
        props = {
            children: 'Foo children',
            theme: {}
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Grid {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Grid {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<Grid {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });
});
