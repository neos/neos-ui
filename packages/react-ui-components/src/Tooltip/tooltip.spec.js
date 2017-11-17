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
            tooltipLabel: 'My tooltip label',
            children: 'Foo children'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<ToolTip {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "tooltipWrapperClassName" prop.', () => {
        const wrapper = shallow(<ToolTip {...props} tooltipWrapperClassName="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<ToolTip {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should initialize with a state of {visible: false}.', () => {
        const wrapper = shallow(<ToolTip {...props}/>);

        expect(wrapper.state()).toEqual({visible: false});
    });

    it('should set the "visible" state property to "true" when calling the show() method.', () => {
        const wrapper = shallow(<ToolTip {...props}/>);

        wrapper.instance().show();

        expect(wrapper.state('visible')).toBe(true);
    });

    it('should set the "visible" state property to "false" when calling the hide() method.', () => {
        const wrapper = shallow(<ToolTip {...props}/>);

        wrapper.instance().hide();

        expect(wrapper.state('visible')).toBe(false);
    });
});
