import test from 'ava';
import api, {createPlugin, define} from './index.js';

test(`
    "createPlugin" utility should expose a method to create plugins which will
    add the given identifier to the constructor.`, t => {
    const plugin = createPlugin('myName', () => null);

    t.is(plugin.identifier, 'myName');
});

test(`
    "define" utility should return a curry function which defines the given
    identifier/value in the given target object.`, t => {
    const target = {};
    const targetDefine = define(target);

    t.is(typeof (targetDefine), 'function');

    targetDefine('myName', 'value');

    t.not(target.myName, undefined);
});

test(`
    "define" utility should throw an error if the given identifier was already
    registered in the parent.`, t => {
    const target = {};
    const targetDefine = define(target);
    const fn = () => targetDefine('myName', 'value');

    targetDefine('myName', 'value');

    t.throws(fn);
});

test('should throw an error if no csrfToken was passed.', t => {
    const fn = () => api({});

    t.throws(fn);
});

test('should place itself inside the specified parent object with the specified alias.', t => {
    const win = {};
    const csrfToken = 'csrfToken';
    const alias = 'test';

    api(win, {csrfToken, alias});

    t.not(win.test, undefined);
});

test('should throw an error if a value already exists under the given alias in parent.', t => {
    const win = {};
    const csrfToken = 'csrfToken';
    const fn = () => api(win, 'csrfToken');

    api(win, {csrfToken});

    t.throws(fn);
});

test('should have a fallback alias "neos" if none was specified.', t => {
    const win = {};
    const csrfToken = 'csrfToken';

    api(win, {csrfToken});

    t.not(win.neos, undefined);
});

test('should not be writable.', t => {
    const win = {};
    const csrfToken = 'csrfToken';
    const fn = () => {
        win.neos = 'test';
    };

    api(win, {csrfToken});

    const oldApi = win.neos;

    t.throws(fn);
    t.is(win.neos, oldApi);
});

test('should expose the use method by default.', t => {
    const win = {};
    const csrfToken = 'csrfToken';

    api(win, {csrfToken});

    t.not(win.neos.use, undefined);
    t.is(typeof (win.neos.use), 'function');
});
