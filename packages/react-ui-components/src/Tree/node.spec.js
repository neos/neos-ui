import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import TreeNode from './node';

describe('<TreeNode/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                panel: 'panelBaseClassName'
            },
            children: 'Foo children'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<TreeNode {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<TreeNode {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<TreeNode {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });
});
