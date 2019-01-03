import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {createStubComponent} from './../_lib/testUtils';
import Tree from './tree';

describe('<Tree/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                panel: 'panelBaseClassName'
            },
            children: 'Foo children',
            NodeComponent: createStubComponent('NodeComponent')
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Tree {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Tree {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the NodeComponent.', () => {
        const wrapper = shallow(<Tree {...props} foo="bar"/>);
        const node = wrapper.find(props.NodeComponent);

        expect(node.prop('foo')).toBe('bar');
    });
});
