import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Icon, {defaultProps, IconProps} from './icon';

describe('<Icon/>', () => {
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
        const wrapper = shallow(<Icon {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Icon {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });
});

