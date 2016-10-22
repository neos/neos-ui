import test from 'ava';

import createConsumerApi, {readFromConsumerApi} from './createConsumerApi';

test(`"readFromConsumerApi" should run fallback, if there's no plugin api present`, t => {
    const fallback = () => ('Hello Neos!');

    t.is(readFromConsumerApi('test', fallback), 'Hello Neos!');
});

test(`"readFromConsumerApi" should run fallback, if the given key is not present in plugin api`, t => {
    window['@Neos:HostPluginAPI'] = {};

    const fallback = () => ('Hello Neos!');

    t.is(readFromConsumerApi('test', fallback), 'Hello Neos!');

    delete window['@Neos:HostPluginAPI'];
});

test(`"readFromConsumerApi" should return plugin value, if the given key is present in plugin api`, t => {
    window['@Neos:HostPluginAPI'] = {
        '@test': 'Hello again, Neos!'
    };

    const fallback = () => ('Hello Neos!');

    t.is(readFromConsumerApi('test', fallback), 'Hello again, Neos!');

    delete window['@Neos:HostPluginAPI'];
});

test(`"createConsumerApi" should create a global, read-only object`, t => {
    t.is(window['@Neos:HostPluginAPI'], undefined);

    createConsumerApi({});

    t.deepEqual(window['@Neos:HostPluginAPI'], {});

    const shouldThrow = () => {
        window['@Neos:HostPluginAPI'] = 'I rudely overwrite the plugin api!';
    };

    t.throws(shouldThrow);

    delete window['@Neos:HostPluginAPI'];
});

test(`"createConsumerApi" should expose the passed api, with each key being read-only`, t => {
    t.is(window['@Neos:HostPluginAPI'], undefined);

    createConsumerApi({
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

test(`"createConsumerApi" should expose the global manifests array`, t => {
    t.is(window['@Neos:HostPluginAPI'], undefined);

    createConsumerApi({});

    t.truthy(window['@Neos:HostPluginAPI']['@manifests']);

    delete window['@Neos:HostPluginAPI'];
});

test(`"createConsumerApi" should expose the global registry`, t => {
    t.is(window['@Neos:HostPluginAPI'], undefined);

    createConsumerApi({});

    t.truthy(window['@Neos:HostPluginAPI']['@globalRegistry']);

    delete window['@Neos:HostPluginAPI'];
});
