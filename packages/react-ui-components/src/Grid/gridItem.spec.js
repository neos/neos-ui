import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import GridItem from './gridItem.js';

describe('<GridItem/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {},
            width: 'third',
            children: 'Foo children'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<GridItem {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<GridItem {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<GridItem {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should render a inline style matching the passed "width" prop.', () => {
        const wrapper = shallow(<GridItem {...props} width="half"/>);

        expect(wrapper.html()).toContain('style="width:50%"');
    });
});
