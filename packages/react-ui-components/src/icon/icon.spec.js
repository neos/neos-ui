import test from 'ava';
import sinon from 'sinon';
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

test('should render a "i" node.', t => {
    const tag = shallow();

    t.truthy(tag.type() === 'i');
});
test('should add the passed "className" prop to the rendered node if passed.', t => {
    const tag = shallow({className: 'testClassName'});

    t.truthy(tag.hasClass('testClassName'));
});
test('should call the "fontAwesome.getClassName" api method and render the returned className.', t => {
    const tag = shallow({icon: 'fooIconClassName'});

    t.truthy(tag.hasClass('fooIconClassName'));
});

test('iconPropValidator() should call the "onDeprecate" in case a migration is needed.', t => {
    const props = {
        icon: 'fooIconClassName',
        _makeValidateId: () => id => ({isValid: false, isMigrationNeeded: true, iconName: id}),
        onDeprecate: sinon.spy()
    };

    iconPropValidator(props, 'icon');

    t.truthy(props.onDeprecate.calledOnce);
});
test('iconPropValidator() should not call the "onDeprecate" multiple times for the same icon id.', t => {
    const props = {
        icon: 'barIconClassName',
        _makeValidateId: () => id => ({isValid: false, isMigrationNeeded: true, iconName: id}),
        onDeprecate: sinon.spy()
    };

    iconPropValidator(props, 'icon');
    iconPropValidator(props, 'icon');

    t.is(props.onDeprecate.callCount, 1);
});
test('iconPropValidator() should return an error if the iconName was not found.', t => {
    const props = {
        icon: 'bazIconClassName',
        _makeValidateId: () => () => ({isValid: false, isMigrationNeeded: false, iconName: null})
    };
    const result = iconPropValidator(props, 'icon');

    t.truthy(result instanceof Error);
});
test('iconPropValidator() should not return an error if no condition was matched.', t => {
    const props = {
        icon: 'bazIconClassName',
        _makeValidateId: () => () => ({})
    };
    const result = iconPropValidator(props, 'icon');

    t.is(result, undefined);
});
