import sinon from 'sinon';
import initializeUse from './index.js';

test(`"api.use" should return a function when called.`, () => {
    expect(typeof (initializeUse())).toBe('function');
});

test(`
    "api.use" should call the "addLibrary" function when initializing a plugin
    factory called.`, () => {
    const apiTarget = {};
    const addLibrary = sinon.spy();
    const use = initializeUse(addLibrary, apiTarget);
    const pluginFactory = () => {};
    pluginFactory.identifier = 'myPlugin';

    use(pluginFactory);

    expect(addLibrary.calledOnce).toBe(true);
    expect(addLibrary.calledWith('myPlugin', pluginFactory())).toBe(true);
});

test(`
    "api.use" should call the "pluginFactory" when initializing a plugin
    factory called.`, () => {
    const apiTarget = {};
    const addLibrary = () => {};
    const use = initializeUse(addLibrary, apiTarget);
    const pluginFactory = sinon.spy();
    pluginFactory.identifier = 'myPlugin';

    use(pluginFactory);

    expect(pluginFactory.calledOnce).toBe(true);
});
