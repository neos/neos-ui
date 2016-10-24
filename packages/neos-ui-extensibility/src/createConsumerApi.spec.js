import test from 'ava';

import createConsumerApi from './createConsumerApi';

test(`"createConsumerApi" should create a global, read-only object`, t => {
    t.is(window['@Neos:HostPluginAPI'], undefined);

    createConsumerApi([], {});

    t.deepEqual(window['@Neos:HostPluginAPI'], {});

    const shouldThrow = () => {
        window['@Neos:HostPluginAPI'] = 'I rudely overwrite the plugin api!';
    };

    t.throws(shouldThrow);

    delete window['@Neos:HostPluginAPI'];
});

test(`"createConsumerApi" should expose the passed api, with each key being read-only`, t => {
    t.is(window['@Neos:HostPluginAPI'], undefined);

    createConsumerApi([], {
        something: 'else',
        andNow: 'to something completely different'
    });

    t.is(window['@Neos:HostPluginAPI'].something, 'else');
    t.is(window['@Neos:HostPluginAPI'].andNow, 'to something completely different');

    const shouldThrow1 = () => {
        window['@Neos:HostPluginAPI'].something = 'I rudely overwrite the something api!';
    };
    const shouldThrow2 = () => {
        window['@Neos:HostPluginAPI'].andNow = 'I rudely overwrite the andNow api!';
    };

    t.throws(shouldThrow1);
    t.throws(shouldThrow2);

    delete window['@Neos:HostPluginAPI'];
});

test(`"createConsumerApi" should expose the initialized manifest function`, t => {
    t.is(window['@Neos:HostPluginAPI'], undefined);

    createConsumerApi([], {});

    t.not(window['@Neos:HostPluginAPI']['@manifest'], undefined);
    t.is(typeof (window['@Neos:HostPluginAPI']['@manifest']), 'function');

    delete window['@Neos:HostPluginAPI'];
});
