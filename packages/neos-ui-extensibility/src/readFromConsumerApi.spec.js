import readFromConsumerApi from './readFromConsumerApi';

test(`
    "readFromConsumerApi" should return a function that complains, if there's no plugin
    api present`, () => {
    const fn = readFromConsumerApi('test');

    expect(fn).toThrow();
});

test(`
    "readFromConsumerApi" should return a function that complains, if the given key is
    not present in plugin api`, () => {
    window['@Neos:HostPluginAPI'] = {};

    const fn = readFromConsumerApi('test');

    expect(fn).toThrow();

    delete window['@Neos:HostPluginAPI'];
});

test(`
    "readFromConsumerApi" should return a function that that runs the plugin function,
    if the given key is present in plugin api`, () => {
    window['@Neos:HostPluginAPI'] = {
        '@test': who => `Hello again, ${who}!`
    };

    const fn = readFromConsumerApi('test');

    expect(fn('Neos')).toBe('Hello again, Neos!');

    delete window['@Neos:HostPluginAPI'];
});
