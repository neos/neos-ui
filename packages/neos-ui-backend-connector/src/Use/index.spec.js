import initializeUse from './index';

test(`"api.use" should return a function when called.`, () => {
    expect(typeof (initializeUse())).toBe('function');
});

test(`
    "api.use" should call the "addLibrary" function when initializing a plugin
    factory called.`, () => {
    const apiTarget = {};
    const addLibrary = jest.fn();
    const use = initializeUse(addLibrary, apiTarget);
    const pluginFactory = () => {};
    pluginFactory.identifier = 'myPlugin';

    use(pluginFactory);

    expect(addLibrary.mock.calls.length).toBe(1);
    expect(addLibrary.mock.calls[0]).toEqual(['myPlugin', pluginFactory()]);
});

test(`
    "api.use" should call the "pluginFactory" when initializing a plugin
    factory called.`, () => {
    const apiTarget = {};
    const addLibrary = () => {};
    const use = initializeUse(addLibrary, apiTarget);
    const pluginFactory = jest.fn();
    pluginFactory.identifier = 'myPlugin';

    use(pluginFactory);

    expect(pluginFactory.mock.calls.length).toBe(1);
});
