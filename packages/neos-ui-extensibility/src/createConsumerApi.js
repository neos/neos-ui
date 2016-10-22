import {version} from '../package.json';
import {manifests} from './manifest';
import {globalRegistry} from './globalRegistry';

const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: true
});

export default function createConsumerApi (exposureMap) {
    const api = {};

    Object.keys(exposureMap).forEach(key => {
        Object.defineProperty(api, key, createReadOnlyValue(exposureMap[key]));
    });

    Object.defineProperty(api, '@manifests', createReadOnlyValue(manifests));

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
    Object.defineProperty(window['@Neos:HostPluginAPI'], 'VERSION', createReadOnlyValue(version));
}
