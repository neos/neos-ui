import {createShallowRenderer} from './../_lib/testUtils.js';
import Icon, {iconPropValidator} from './icon.js';

const defaultProps = {
    theme: {},
    iconMap: {},
    _makeValidateId: () => id => ({isValid: true, isMigrationNeeded: false, iconName: id}),
    _makeGetClassName: () => id => id,
    onDeprecate: () => null
};
const shallow = createShallowRenderer(Icon, defaultProps);

test('should render a "i" node.', () => {
    const tag = shallow();

    expect(tag.type()).toBe('i');
});
test('should add the passed "className" prop to the rendered node if passed.', () => {
    const tag = shallow({className: 'testClassName'});

    expect(tag.hasClass('testClassName')).toBeTruthy();
});
test('should call the "fontAwesome.getClassName" api method and render the returned className.', () => {
    const tag = shallow({icon: 'fooIconClassName'});

    expect(tag.hasClass('fooIconClassName')).toBeTruthy();
});

test('iconPropValidator() should call the "onDeprecate" in case a migration is needed.', () => {
    const props = {
        icon: 'fooIconClassName',
        _makeValidateId: () => id => ({isValid: false, isMigrationNeeded: true, iconName: id}),
        onDeprecate: jest.fn()
    };

    iconPropValidator(props, 'icon');

    expect(props.onDeprecate.mock.calls.length).toBe(1);
});
test('iconPropValidator() should not call the "onDeprecate" multiple times for the same icon id.', () => {
    const props = {
        icon: 'barIconClassName',
        _makeValidateId: () => id => ({isValid: false, isMigrationNeeded: true, iconName: id}),
        onDeprecate: jest.fn()
    };

    iconPropValidator(props, 'icon');
    iconPropValidator(props, 'icon');

    expect(props.onDeprecate.mock.calls.length).toBe(1);
});
test('iconPropValidator() should return an error if the iconName was not found.', () => {
    const props = {
        icon: 'bazIconClassName',
        _makeValidateId: () => () => ({isValid: false, isMigrationNeeded: false, iconName: null})
    };
    const result = iconPropValidator(props, 'icon');

    expect(result instanceof Error).toBeTruthy();
});
test('iconPropValidator() should not return an error if no condition was matched.', () => {
    const props = {
        icon: 'bazIconClassName',
        _makeValidateId: () => () => ({})
    };
    const result = iconPropValidator(props, 'icon');

    expect(result).toBe(undefined);
});
