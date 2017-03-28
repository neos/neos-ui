import test from 'ava';
import sinon from 'sinon';
import factory, {
    isStartingOperation,
    isFinishingOperation,
    createNodeEnvelope,
    isNodeEnvelope,
    resolveChain
} from './index.js';

test(`
    "api.flowQuery > isStartingOperation" utility should return a falsy boolean
    if no operation object was passed.`, t => {
    t.false(isStartingOperation());
});

test(`
    "api.flowQuery > isStartingOperation" utility should return a falsy boolean
    if the given operation is not a type of "createContext".`, t => {
    t.false(isStartingOperation({type: 'FOO'}));
});

test(`
    "api.flowQuery > isStartingOperation" utility should return a truthy boolean
    if the given operation is a type of "createContext".`, t => {
    t.true(isStartingOperation({type: 'createContext'}));
});

test(`
    "api.flowQuery > isFinishingOperation" utility should return a falsy boolean
    if no operation object was passed.`, t => {
    t.false(isFinishingOperation());
});

test(`
    "api.flowQuery > isFinishingOperation" utility should return a falsy boolean
    if the given operation is not a type of "GET" or "COUNT".`, t => {
    t.false(isFinishingOperation({type: 'createContext'}));
});

test(`
    "api.flowQuery > isFinishingOperation" utility should return a truthy boolean
    if the given operation is a type of "GET".`, t => {
    t.true(isFinishingOperation({type: 'GET'}));
});

test(`
    "api.flowQuery > isFinishingOperation" utility should return a truthy boolean
    if the given operation is a type of "COUNT".`, t => {
    t.true(isFinishingOperation({type: 'COUNT'}));
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should throw an error if no
    argument was passed.`, t => {
    const fn = () => createNodeEnvelope();

    t.throws(fn);
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should throw an error if an array
    was passed as the argument.`, t => {
    const fn = () => createNodeEnvelope([]);

    t.throws(fn);
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return an object containing
    the contextPath of the passed node if the passed argument is a string.`, t => {
    const result = createNodeEnvelope('my.contextPath');

    t.not(result.$node, undefined);
    t.is(result.$node, 'my.contextPath');
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should throw an error if the passed
    object has no "$node" or "contextPath" key/value pair.`, t => {
    const fn = () => createNodeEnvelope({foo: 'bar'});

    t.throws(fn);
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return an object containing
    the contextPath of the passed node if the passed argument is a object containing a
    "contextPath" key/value pair.`, t => {
    const result = createNodeEnvelope({contextPath: 'another.contextPath'});

    t.not(result.$node, undefined);
    t.is(result.$node, 'another.contextPath');
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return an object containing the
    contextPath of the passed node if the passed argument is a object containing a
    "$node" key/value pair.`, t => {
    const result = createNodeEnvelope({$node: 'yet.another.contextPath'});

    t.not(result.$node, undefined);
    t.is(result.$node, 'yet.another.contextPath');
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return a falsy boolean if
    no argument was passed.`, t => {
    t.false(isNodeEnvelope());
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return a falsy boolean if
    the the passed argument is an array.`, t => {
    t.false(isNodeEnvelope([]));
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return a truthy boolean if
    the the passed argument is an object which does not contain an "$node" key/value pair.`, t => {
    t.false(isNodeEnvelope({foo: 'bar'}));
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return a truthy boolean if
    the passed argument is an object which does contain an "$node" key/value pair.`, t => {
    t.true(isNodeEnvelope({$node: 'foo'}));
});

test(`"api.flowQuery > resolveChain" utility should make a fetch call.`, t => {
    const result = resolveChain({}, 'csrfToken');

    t.not(result.then, undefined);
    t.is(typeof (result.then), 'function');
});

test(`"api.flowQuery > factory" should throw an error if no csrfToken was provided.`, t => {
    const fn = () => factory();

    t.throws(fn);
});

test(`"api.flowQuery > factory" should throw an error if an empty csrfToken was provided.`, t => {
    const fn = () => factory('');

    t.throws(fn);
});

test(`"api.flowQuery > factory" should expose the "q" function and its "applyMiddleware" method.`, t => {
    const q = factory('csrfToken');

    t.is(typeof (q), 'function');
    t.is(typeof (q.applyMiddleware), 'function');
});

test(`"api.flowQuery > api" should expose all operations as methods of the api.`, t => {
    const q = factory('csrfToken');
    const api = q('myContextPath');

    t.is(typeof (api), 'object');
    t.not(api.children, undefined);
    t.not(api.get, undefined);
});

test(`
    "api.flowQuery > api" should throw an error if an argument was passed which is
    not a string, array nor an object with an "contextPath" key/value pair.`, t => {
    const q = factory('csrfToken');
    const fn = () => q(2);

    t.throws(fn);
});

test(`
    "api.flowQuery > api" should not throw an error if provided with an object
    containing an "contextPath" key/value pair.`, t => {
    const q = factory('csrfToken');
    const fn = () => q({
        contextPath: 'myContextPath'
    });

    t.notThrows(fn);
});

test(`"api.flowQuery > api" should not throw an error if provided with an string.`, t => {
    const q = factory('csrfToken');
    const fn = () => q('myContextPath');

    t.notThrows(fn);
});

test(`
    "api.flowQuery > api" should apply the the given middleware function and call it
    when executing an operation method.`, t => {
    const q = factory('csrfToken');
    const middleware = sinon.spy();

    q.applyMiddleware(middleware);

    q('myContextPath').children('[instanceof Neos.Neos:Document]');

    t.true(middleware.calledOnce);
});

test(`
    "api.flowQuery > api" should apply the the given middleware function but ignore it
    when passing a truthy boolean as the second argument of the API.`, t => {
    const q = factory('csrfToken');
    const middleware = sinon.spy();

    q.applyMiddleware(middleware);

    q('myContextPath', true).children('[instanceof Neos.Neos:Document]');

    t.false(middleware.called);
});
