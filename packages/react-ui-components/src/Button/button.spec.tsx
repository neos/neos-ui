import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Button, {ButtonProps, defaultProps} from './button';

describe('<Button/>', () => {
    const props: ButtonProps = {
        ...defaultProps,
        children: 'Foo children',
        className: 'foo className',
        hoverStyle: 'clean',
        onClick: () => null,
        style: 'clean',
        theme: {
            'btn': 'btnClassName',
            'btn--brand': 'brandClassName',
            'btn--brandActive': 'brandActiveClassName',
            'btn--brandHover': 'brandHoverClassName',
            'btn--clean': 'cleanClassName',
            'btn--cleanHover': 'cleanHoverClassName',
            'btn--darkenHover': 'darkenHoverClassName',
            'btn--isPressed': 'isPressedClassName',
            'btn--lighter': 'lighterClassName',
            'btn--transparent': 'transparentClassName',
        },
    };

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
        const wrapper = shallow(<Button {...props} autoFocus={true}/>);

        expect(wrapper.prop('autoFocus')).toBe(true);
    });

    it('should always render the "brand" and "brandHover" theme classNames in case the "isActive" prop is truthy.', () => {
        const wrapper = shallow(<Button {...props} isActive={true}/>);

        expect(wrapper.hasClass(props.theme!['btn--clean'])).toBeFalsy();
        expect(wrapper.hasClass(props.theme!['btn--cleanHover'])).toBeFalsy();
        expect(wrapper.hasClass(props.theme!['btn--brand'])).toBeTruthy();
        expect(wrapper.hasClass(props.theme!['btn--brandHover'])).toBeTruthy();
    });

    it('should render the "style" and "hoverStyle" theme classNames in case the "isActive" prop is falsy.', () => {
        const wrapper = shallow(<Button {...props} isActive={false}/>);

        expect(wrapper.hasClass(props.theme!['btn--clean'])).toBeTruthy();
        expect(wrapper.hasClass(props.theme!['btn--cleanHover'])).toBeTruthy();
        expect(wrapper.hasClass(props.theme!['btn--brand'])).toBeFalsy();
        expect(wrapper.hasClass(props.theme!['btn--brandHover'])).toBeFalsy();
    });

    it('should not render the disabled attribute when passing a falsy "disabled" prop.', () => {
        const wrapper = shallow(<Button {...props} isActive={false}/>);

        expect(wrapper.html()).not.toContain('disabled=""');
    });

    it('should render the disabled attribute when passing a truthy "disabled" prop.', () => {
        const wrapper = shallow(<Button {...props} isActive={true}/>);

        expect(wrapper.html()).not.toContain('disabled=""');
    });

    it('should call the "_refHandler" prop with the current "isFocused" prop when rendering the node.', () => {
        const _refHandler = jest.fn();

        shallow(<Button {...props} isFocused={false} _refHandler={_refHandler}/>);

        expect(_refHandler.mock.calls.length).toBe(1);
        expect(_refHandler.mock.calls[0][0]).toBe(false);
    });
});
