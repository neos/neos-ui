import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {defaultProps} from './iconDefaultProps';
import {IconProps} from './icon';
import FontAwesomeIcon from './fontAwesomeIcon';

describe('<FontAwesomeIcon/>', () => {
    const props: IconProps = {
        ...defaultProps,
        icon: 'fooIconClassName',
        theme: {
            'icon': 'iconClassName',
            'icon--big': 'bigClassName',
            'icon--color-error': 'color-errorClassName',
            'icon--color-primaryBlue': 'color-primaryBlueClassName',
            'icon--color-warn': 'color-warnClassName',
            'icon--paddedLeft': 'paddedLeftClassName',
            'icon--paddedRight': 'paddedRightClassName',
            'icon--small': 'smallClassName',
            'icon--spin': 'spinClassName',
            'icon--tiny': 'tinyClassName',
            'icon--large': 'largeClassName',
            'icon--huge': 'hugeClassName'
        }
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<FontAwesomeIcon {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<FontAwesomeIcon {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should call the "fontAwesome.getClassName" api method and render the returned className.', () => {
        const wrapper = shallow(<FontAwesomeIcon {...props}/>);
        expect(wrapper.hasClass('fooIconClassName')).toBeTruthy();
    });

    it('should allow the propagation of custom "icon" with the "icon" prop.', () => {
        const wrapper = shallow(<FontAwesomeIcon {...props} icon="bazIconClassName"/>);
        expect(wrapper.hasClass('bazIconClassName')).toBeTruthy();
    });
});

