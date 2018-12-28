import factory, {
    isStartingOperation,
    isFinishingOperation,
    createNodeEnvelope,
    isNodeEnvelope,
    resolveChain
} from './index';
import fetchWithErrorHandling from '../FetchWithErrorHandling';

test(`
    "api.flowQuery > isStartingOperation" utility should return a falsy boolean
    if no operation object was passed.`, () => {
    expect(isStartingOperation()).toBe(false);
});

test(`
    "api.flowQuery > isStartingOperation" utility should return a falsy boolean
    if the given operation is not a type of "CREATE_CONTEXT".`, () => {
    expect(isStartingOperation({type: 'FOO', payload: 'bar'})).toBe(false);
});

test(`
    "api.flowQuery > isStartingOperation" utility should return a truthy boolean
    if the given operation is a type of "createContext".`, () => {
    expect(isStartingOperation({type: 'createContext', payload: []})).toBe(true);
});

test(`
    "api.flowQuery > isFinishingOperation" utility should return a falsy boolean
    if no operation object was passed.`, () => {
    expect(isFinishingOperation()).toBe(false);
});

test(`
    "api.flowQuery > isFinishingOperation" utility should return a falsy boolean
    if the given operation is not a type of "GET" or "COUNT".`, () => {
    expect(isFinishingOperation({type: 'CREATE_CONTEXT', payload: []})).toBe(false);
});

test(`
    "api.flowQuery > isFinishingOperation" utility should return a truthy boolean
    if the given operation is a type of "GET".`, () => {
    expect(isFinishingOperation({type: 'get', payload: 'anything'})).toBe(true);
});

test(`
    "api.flowQuery > isFinishingOperation" utility should return a truthy boolean
    if the given operation is a type of "count".`, () => {
    expect(isFinishingOperation({type: 'count', payload: []})).toBe(true);
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should throw an error if no
    argument was passed.`, () => {
    const fn = () => createNodeEnvelope();

    expect(fn).toThrow();
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should throw an error if an array
    was passed as the argument.`, () => {
    const fn = () => createNodeEnvelope([]);

    expect(fn).toThrow();
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return an object containing
    the contextPath of the passed node if the passed argument is a string.`, () => {
    const result = createNodeEnvelope('my.contextPath');

    expect(result.$node).not.toBe(undefined);
    expect(result.$node).toBe('my.contextPath');
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should throw an error if the passed
    object has no "$node" or "contextPath" key/value pair.`, () => {
    const fn = () => createNodeEnvelope({foo: 'bar'});

    expect(fn).toThrow();
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return an object containing
    the contextPath of the passed node if the passed argument is a object containing a
    "contextPath" key/value pair.`, () => {
    const result = createNodeEnvelope({contextPath: 'another.contextPath'});

    expect(result.$node).not.toBe(undefined);
    expect(result.$node).toBe('another.contextPath');
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return an object containing the
    contextPath of the passed node if the passed argument is a object containing a
    "$node" key/value pair.`, () => {
    const result = createNodeEnvelope({$node: 'yet.another.contextPath'});

    expect(result.$node).not.toBe(undefined);
    expect(result.$node).toBe('yet.another.contextPath');
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return a falsy boolean if
    no argument was passed.`, () => {
    expect(isNodeEnvelope()).toBe(false);
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return a falsy boolean if
    the the passed argument is an array.`, () => {
    expect(isNodeEnvelope([])).toBe(false);
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return a truthy boolean if
    the the passed argument is an object which does not contain an "$node" key/value pair.`, () => {
    expect(isNodeEnvelope({foo: 'bar'})).toBe(false);
});

test(`
    "api.flowQuery > createNodeEnvelope" utility should return a truthy boolean if
    the passed argument is an object which does contain an "$node" key/value pair.`, () => {
    expect(isNodeEnvelope({$node: 'foo'})).toBe(true);
});

test(`"api.flowQuery > resolveChain" utility should make a fetch call.`, () => {
    fetchWithErrorHandling.setCsrfToken('asdf');
    const result = resolveChain({}, {ui: {service: {flowQuery: 'https://hello.world'}}});

    expect(result.then).not.toBe(undefined);
    expect(typeof (result.then)).toBe('function');
});

test(`"api.flowQuery > factory" should expose the "q" function and its "applyMiddleware" method.`, () => {
    const q = factory();

    expect(typeof (q)).toBe('function');
    expect(typeof (q.applyMiddleware)).toBe('function');
});

test(`"api.flowQuery > api" should expose all operations as methods of the api.`, () => {
    const q = factory();
    const api = q('myContextPath');

    expect(typeof (api)).toBe('object');
    expect(api.children).not.toBe(undefined);
    expect(api.get).not.toBe(undefined);
});

test(`
    "api.flowQuery > api" should throw an error if an argument was passed which is
    not a string, array nor an object with an "contextPath" key/value pair.`, () => {
    const q = factory();
    const fn = () => q(2);

    expect(fn).toThrow();
});

test(`
    "api.flowQuery > api" should not throw an error if provided with an object
    containing an "contextPath" key/value pair.`, () => {
    const q = factory();
    const fn = () => q({
        contextPath: 'myContextPath'
    });

    expect(fn).not.toThrow();
});

test(`"api.flowQuery > api" should not throw an error if provided with an string.`, () => {
    const q = factory();
    const fn = () => q('myContextPath');

    expect(fn).not.toThrow();
});

test(`
    "api.flowQuery > api" should apply the the given middleware function and call it
    when executing an operation method.`, () => {
    const q = factory();
    const middleware = jest.fn();

    q.applyMiddleware(middleware);

    q('myContextPath').children('[instanceof Neos.Neos:Document]');

    expect(middleware.mock.calls.length).toBe(1);
});

test(`
    "api.flowQuery > api" should apply the the given middleware function but ignore it
    when passing a truthy boolean as the second argument of the API.`, () => {
    const q = factory();
    const middleware = jest.fn();

    q.applyMiddleware(middleware);

    q('myContextPath', true).children('[instanceof Neos.Neos:Document]');

    expect(middleware.mock.calls.length).toBe(0);
});
