import test from 'ava';

import readFromConsumerApi from './readFromConsumerApi';

test(`"readFromConsumerApi" should complain, if there's no plugin api present`, t => {
    const fn = () => readFromConsumerApi('test');

    t.throws(fn);
});

test(`"readFromConsumerApi" should complain, if the given key is not present in plugin api`, t => {
    window['@Neos:HostPluginAPI'] = {};

    const fn = () => readFromConsumerApi('test');

    t.throws(fn);

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
