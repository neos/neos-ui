import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Icon, {iconPropValidator} from './icon.js';

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
        const wrapper = shallow(<Icon {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
});

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Icon {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
});

    it('should call the "fontAwesome.getClassName" api method and render the returned className.', () => {
        const wrapper = shallow(<Icon {...props} icon="fooIconClassName"/>);

        expect(wrapper.hasClass('fooIconClassName')).toBeTruthy();
    });
});

describe('iconPropValidator()', () => {
    it('should call the "onDeprecate" in case a migration is needed.', () => {
    const props = {
        icon: 'fooIconClassName',
        _makeValidateId: () => id => ({isValid: false, isMigrationNeeded: true, iconName: id}),
            onDeprecate: jest.fn()
    };

    iconPropValidator(props, 'icon');

        expect(props.onDeprecate.mock.calls.length).toBe(1);
});
    it('should not call the "onDeprecate" multiple times for the same icon id.', () => {
    const props = {
        icon: 'barIconClassName',
        _makeValidateId: () => id => ({isValid: false, isMigrationNeeded: true, iconName: id}),
            onDeprecate: jest.fn()
    };

    iconPropValidator(props, 'icon');
    iconPropValidator(props, 'icon');

        expect(props.onDeprecate.mock.calls.length).toBe(1);
});
    it('should return an error if the iconName was not found.', () => {
    const props = {
        icon: 'bazIconClassName',
        _makeValidateId: () => () => ({isValid: false, isMigrationNeeded: false, iconName: null})
    };
    const result = iconPropValidator(props, 'icon');

    expect(result instanceof Error).toBeTruthy();
});
    it('should not return an error if no condition was matched.', () => {
    const props = {
        icon: 'bazIconClassName',
        _makeValidateId: () => () => ({})
    };
    const result = iconPropValidator(props, 'icon');

    expect(result).toBe(undefined);
    });
});
