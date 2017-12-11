import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {Tooltip} from './tooltip.js';

describe('<Tooltip/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                tooltip: 'tooltipClassName'
            },
            label: 'My tooltip label',
            children: 'Foo children'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Tooltip {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "wrapperClassName" prop.', () => {
        const wrapper = shallow(<Tooltip {...props} wrapperClassName="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<Tooltip {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should initialize with a state of {isVisible: false} if the "type" prop does not equal "error".', () => {
        expect(shallow(<Tooltip {...props}/>).state('isVisible')).toBe(false);
        expect(shallow(<Tooltip {...props} type="error"/>).state('isVisible')).toBe(true);
    });

    it('should set the "isVisible" state property to "true" when calling the show() method.', () => {
        const wrapper = shallow(<Tooltip {...props}/>);

        wrapper.instance().show();

        expect(wrapper.state('isVisible')).toBe(true);
    });

    it('should set the "isVisible" state property to "false" when calling the hide() method.', () => {
        const wrapper = shallow(<Tooltip {...props}/>);

        wrapper.instance().hide();

        expect(wrapper.state('isVisible')).toBe(false);
    });

    it('should set the "isVisible" state property to "true" when calling the handleTouch() method.', () => {
        const wrapper = shallow(<Tooltip {...props}/>);

        wrapper.instance().handleTouch();

        expect(wrapper.state('isVisible')).toBe(true);
    });

    it('should set the "isVisible" state property to "false" when calling the handleClickOutside() method.', () => {
        const wrapper = shallow(<Tooltip {...props}/>);

        wrapper.instance().handleClickOutside();

        expect(wrapper.state('isVisible')).toBe(false);
    });
});
