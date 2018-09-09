import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Icon from './icon.js';

describe('<Icon/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {},
            iconMap: {},
            _makeValidateId: () => id => ({isValid: true, isMigrationNeeded: false, iconName: id}),
            _makeGetClassName: () => id => id,
            onDeprecate: () => null
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Icon icon="fooIconClassName" {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Icon {...props} icon="fooIconClassName" className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should call the "fontAwesome.getClassName" api method and render the returned className.', () => {
        const wrapper = shallow(<Icon {...props} icon="fooIconClassName"/>);

        expect(wrapper.hasClass('fooIconClassName')).toBeTruthy();
    });

    it('should allow the propagation of custom "icon" with the "icon" prop.', () => {
        const wrapper = shallow(<Icon {...props} icon="bazIconClassName"/>);

        expect(wrapper.hasClass('bazIconClassName')).toBeTruthy();
    });
});

