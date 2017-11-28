import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Button from './button.js';

describe('<Button/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                'btn--clean': 'cleanClassName',
                'btn--brand': 'brandClassName',
                'btn--cleanHover': 'cleanHoverClassName',
                'btn--brandHover': 'brandHoverClassName'
            },
            className: 'foo className',
            children: 'Foo children',
            onClick: () => null,
            style: 'clean',
            hoverStyle: 'clean',
            type: 'button'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Button {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Button {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of "type" with the "type" prop.', () => {
        const wrapper = shallow(<Button {...props} type="submit"/>);

        expect(wrapper.prop('type')).toContain('submit');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<Button {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should always render the "brand" and "brandHover" theme classNames in case the "isActive" prop is truthy.', () => {
        const wrapper = shallow(<Button {...props} isActive/>);

        expect(wrapper.hasClass(props.theme['btn--clean'])).toBeFalsy();
        expect(wrapper.hasClass(props.theme['btn--cleanHover'])).toBeFalsy();
        expect(wrapper.hasClass(props.theme['btn--brand'])).toBeTruthy();
        expect(wrapper.hasClass(props.theme['btn--brandHover'])).toBeTruthy();
    });

    it('should render the "style" and "hoverStyle" theme classNames in case the "isActive" prop is falsy.', () => {
        const wrapper = shallow(<Button {...props} isActive={false}/>);

        expect(wrapper.hasClass(props.theme['btn--clean'])).toBeTruthy();
        expect(wrapper.hasClass(props.theme['btn--cleanHover'])).toBeTruthy();
        expect(wrapper.hasClass(props.theme['btn--brand'])).toBeFalsy();
        expect(wrapper.hasClass(props.theme['btn--brandHover'])).toBeFalsy();
    });

    it('should not render the disabled attribute when passing a falsy "isDisabled" prop.', () => {
        const wrapper = shallow(<Button {...props} isActive={false}/>);

        expect(wrapper.html()).not.toContain('disabled=""');
    });

    it('should render the disabled attribute when passing a truthy "isDisabled" prop.', () => {
        const wrapper = shallow(<Button {...props} isActive/>);

        expect(wrapper.html()).not.toContain('disabled=""');
    });

    it('should call the "_refHandler" prop with the current "isFocused" prop when rendering the node.', () => {
        const _refHandler = jest.fn();

        shallow(<Button {...props} isFocused={false} _refHandler={_refHandler}/>);

        expect(_refHandler.mock.calls.length).toBe(1);
        expect(_refHandler.mock.calls[0][0]).toBe(false);
    });
});
