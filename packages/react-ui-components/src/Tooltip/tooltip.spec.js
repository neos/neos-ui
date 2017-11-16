import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import ToolTip from './tooltip.js';

describe('<ToolTip/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                tooltip: 'tooltipClassName'
            },
            children: 'Foo children'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<ToolTip {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ToolTip {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<ToolTip {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });
});
