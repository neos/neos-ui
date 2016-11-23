import test from 'ava';

import readFromConsumerApi from './readFromConsumerApi';

test(`
    "readFromConsumerApi" should return a function that complains, if there's no plugin
    api present`, t => {
    const fn = readFromConsumerApi('test');

    t.throws(fn);
});

test(`
    "readFromConsumerApi" should return a function that complains, if the given key is
    not present in plugin api`, t => {
    window['@Neos:HostPluginAPI'] = {};

    const fn = readFromConsumerApi('test');

    t.throws(fn);

    delete window['@Neos:HostPluginAPI'];
});

test(`
    "readFromConsumerApi" should return a function that that runs the plugin function,
    if the given key is present in plugin api`, t => {
    window['@Neos:HostPluginAPI'] = {
        '@test': who => `Hello again, ${who}!`
    };

    const fn = readFromConsumerApi('test');

    t.is(fn('Neos'), 'Hello again, Neos!');

    delete window['@Neos:HostPluginAPI'];
});
