import test from 'ava';

import readFromConsumerApi from './readFromConsumerApi';

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
