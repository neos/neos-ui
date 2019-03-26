import {initializeJsAPI, createPlugin, define} from './index';

test(`
    "createPlugin" utility should expose a method to create plugins which will
    add the given identifier to the constructor.`, () => {
    const plugin = createPlugin('myName', () => null);

    expect(plugin.identifier).toBe('myName');
});

test(`
    "define" utility should return a curry function which defines the given
    identifier/value in the given target object.`, () => {
    const target = {};
    const targetDefine = define(target);

    expect(typeof (targetDefine)).toBe('function');

    targetDefine('myName', 'value');

    expect(target.myName).not.toBe(undefined);
});

test(`
    "define" utility should throw an error if the given identifier was already
    registered in the parent.`, () => {
    const target = {};
    const targetDefine = define(target);
    const fn = () => targetDefine('myName', 'value');

    targetDefine('myName', 'value');

    expect(fn).toThrow();
});

test('should throw an error if no csrfToken was passed.', () => {
    const fn = () => initializeJsAPI({});

    expect(fn).toThrow();
});

test('should place itself inside the specified parent object with the specified alias.', () => {
    const win = {};
    const csrfToken = 'csrfToken';
    const alias = 'test';

    initializeJsAPI(win, {csrfToken, alias});

    expect(win.test).not.toBe(undefined);
});

test('should throw an error if a value already exists under the given alias in parent.', () => {
    const win = {};
    const csrfToken = 'csrfToken';
    const fn = () => initializeJsAPI(win, 'csrfToken');

    initializeJsAPI(win, {csrfToken});

    expect(fn).toThrow();
});

test('should have a fallback alias "neos" if none was specified.', () => {
    const win = {};
    const csrfToken = 'csrfToken';

    initializeJsAPI(win, {csrfToken});

    expect(win.neos).not.toBe(undefined);
});

test('should not be writable.', () => {
    const win = {};
    const csrfToken = 'csrfToken';
    const fn = () => {
        win.neos = 'test';
    };

    initializeJsAPI(win, {csrfToken});

    const oldApi = win.neos;

    expect(fn).toThrow();
    expect(win.neos).toBe(oldApi);
});

test('should expose the use method by default.', () => {
    const win = {};
    const csrfToken = 'csrfToken';

    initializeJsAPI(win, {csrfToken});

    expect(win.neos.use).not.toBe(undefined);
    expect(typeof (win.neos.use)).toBe('function');
});
