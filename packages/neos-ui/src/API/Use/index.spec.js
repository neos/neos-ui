import test from 'ava';
import sinon from 'sinon';
import initializeUse from './index.js';

test(`"api.use" should return a function when called.`, t => {
    t.is(typeof (initializeUse()), 'function');
});

test(`
    "api.use" should call the "addLibrary" function when initializing a plugin
    factory called.`, t => {
    const apiTarget = {};
    const addLibrary = sinon.spy();
    const use = initializeUse(addLibrary, apiTarget);
    const pluginFactory = () => {};
    pluginFactory.identifier = 'myPlugin';

    use(pluginFactory);

    t.true(addLibrary.calledOnce);
    t.true(addLibrary.calledWith('myPlugin', pluginFactory()));
});

test(`
    "api.use" should call the "pluginFactory" when initializing a plugin
    factory called.`, t => {
    const apiTarget = {};
    const addLibrary = () => {};
    const use = initializeUse(addLibrary, apiTarget);
    const pluginFactory = sinon.spy();
    pluginFactory.identifier = 'myPlugin';

    use(pluginFactory);

    t.true(pluginFactory.calledOnce);
});
