import test from 'ava';
import {makeValidateId, makeGetClassName} from './fontAwesome.js';

const icons = {
    'fa-foo': 'fooIconClassName',
    'fa-glass': 'glassIconClassName'
};
const validateId = makeValidateId(icons);
const getClassName = makeGetClassName(icons);

test('validateId() should return an object containing at least key value pairs for "isValid" and "iconName".', t => {
    const results = validateId('test');

    t.truthy(results.isValid !== undefined);
    t.truthy(results.iconName !== undefined);
});
test('validateId() should return a falsy "isValid" value if no id was passed.', t => {
    const results = validateId();

    t.falsy(results.isValid);
});
test('validateId() should return a falsy "isValid" value if the passed id was not found in the Font-Awesome icon names.', t => {
    const results = validateId('bar');

    t.falsy(results.isValid);
});
test('validateId() should not return a "iconName" value if the passed id was not found in the Font-Awesome icon names.', t => {
    const results = validateId('bar');

    t.is(results.iconName, null);
});
test('validateId() should return truthy "isValid" value if the passed id was found in the Font-Awesome icon names.', t => {
    const results = validateId('fa-foo');

    t.truthy(results.isValid);
});
test('validateId() should return the given id as the "iconName" if the passed id was found in the Font-Awesome icon names.', t => {
    const results = validateId('fa-foo');

    t.is(results.iconName, 'fa-foo');
});
test('validateId() should automatically add the "fa-" prefix to the given id before starting the validation.', t => {
    const results = validateId('foo');

    t.truthy(results.isValid);
    t.is(results.iconName, 'fa-foo');
});
test('validateId() should migrate old icon ids to the new newest version.', t => {
    const results = validateId('icon-glass');

    t.falsy(results.isValid);
    t.truthy(results.isMigrationNeeded);
    t.is(results.iconName, 'fa-glass');
});

test('getClassName() should return "undefined" if the passed id is invalid.', t => {
    const result = getClassName('test');

    t.is(result, undefined);
});
test('getClassName() should return the icon className if the passed id is valid.', t => {
    const result = getClassName('fa-foo');

    t.is(result, 'fooIconClassName');
});
test('getClassName() should apply the migration logic of the "validateId" to the passed id and should return the className of an outdated id.', t => {
    const result = getClassName('icon-glass');

    t.is(result, 'glassIconClassName');
});
