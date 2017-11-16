import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Bar from './bar.js';

describe('<Bar/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {},
            children: 'Foo children',
            position: 'top'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Bar {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Bar {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<Bar {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });
});
