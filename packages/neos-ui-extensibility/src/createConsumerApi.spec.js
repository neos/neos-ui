import createConsumerApi from './createConsumerApi';

test(`"createConsumerApi" should create a global, read-only object`, () => {
    createConsumerApi([], {});

    expect(window['@Neos:HostPluginAPI']).toEqual({});

    const shouldThrow = () => {
        window['@Neos:HostPluginAPI'] = 'I rudely overwrite the plugin api!';
    };

    expect(shouldThrow).toThrow();

    delete window['@Neos:HostPluginAPI'];
});

test(`"createConsumerApi" should expose the passed api, with each key being read-only`, () => {
    createConsumerApi([], {
        something: 'else',
        andNow: 'to something completely different'
    });

    expect(window['@Neos:HostPluginAPI'].something).toBe('else');
    expect(window['@Neos:HostPluginAPI'].andNow).toBe('to something completely different');

    const shouldThrow1 = () => {
        window['@Neos:HostPluginAPI'].something = 'I rudely overwrite the something api!';
    };
    const shouldThrow2 = () => {
        window['@Neos:HostPluginAPI'].andNow = 'I rudely overwrite the andNow api!';
    };

    expect(shouldThrow1).toThrow();
    expect(shouldThrow2).toThrow();

    delete window['@Neos:HostPluginAPI'];
});

test(`"createConsumerApi" should expose the initialized manifest function`, () => {
    createConsumerApi([], {});

    expect(window['@Neos:HostPluginAPI']['@manifest']).not.toBe(undefined);
    expect(typeof (window['@Neos:HostPluginAPI']['@manifest'])).toBe('function');

    delete window['@Neos:HostPluginAPI'];
});
