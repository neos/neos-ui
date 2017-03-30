import {makeValidateId, makeGetClassName} from './fontAwesome.js';

const icons = {
    'fa-foo': 'fooIconClassName',
    'fa-glass': 'glassIconClassName'
};
const validateId = makeValidateId(icons);
const getClassName = makeGetClassName(icons);

test('validateId() should return an object containing at least key value pairs for "isValid" and "iconName".', () => {
    const results = validateId('test');

    expect(results.isValid !== undefined).toBeTruthy();
    expect(results.iconName !== undefined).toBeTruthy();
});
test('validateId() should return a falsy "isValid" value if no id was passed.', () => {
    const results = validateId();

    expect(results.isValid).toBeFalsy();
});
test('validateId() should return a falsy "isValid" value if the passed id was not found in the Font-Awesome icon names.', () => {
    const results = validateId('bar');

    expect(results.isValid).toBeFalsy();
});
test('validateId() should not return a "iconName" value if the passed id was not found in the Font-Awesome icon names.', () => {
    const results = validateId('bar');

    expect(results.iconName).toBe(null);
});
test('validateId() should return truthy "isValid" value if the passed id was found in the Font-Awesome icon names.', () => {
    const results = validateId('fa-foo');

    expect(results.isValid).toBeTruthy();
});
test('validateId() should return the given id as the "iconName" if the passed id was found in the Font-Awesome icon names.', () => {
    const results = validateId('fa-foo');

    expect(results.iconName).toBe('fa-foo');
});
test('validateId() should automatically add the "fa-" prefix to the given id before starting the validation.', () => {
    const results = validateId('foo');

    expect(results.isValid).toBeTruthy();
    expect(results.iconName).toBe('fa-foo');
});
test('validateId() should migrate old icon ids to the new newest version.', () => {
    const results = validateId('icon-glass');

    expect(results.isValid).toBeTruthy();
    expect(results.iconName).toBe('fa-glass');
});

test('getClassName() should return "undefined" if the passed id is invalid.', () => {
    const result = getClassName('test');

    expect(result).toBe(undefined);
});
test('getClassName() should return the icon className if the passed id is valid.', () => {
    const result = getClassName('fa-foo');

    expect(result).toBe('fooIconClassName');
});
test('getClassName() should apply the migration logic of the "validateId" to the passed id and should return the className of an outdated id.', () => {
    const result = getClassName('icon-glass');

    expect(result).toBe('glassIconClassName');
});
