import {version} from '../package.json';
import createManifestFunction from './manifest';

const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: true
});

export default function createConsumerApi(manifests, exposureMap) {
    const api = {};

    Object.keys(exposureMap).forEach(key => {
        Object.defineProperty(api, key, createReadOnlyValue(exposureMap[key]));
    });

    Object.defineProperty(api, '@manifest', createReadOnlyValue(
        createManifestFunction(manifests)
    ));

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
    Object.defineProperty(window['@Neos:HostPluginAPI'], 'VERSION', createReadOnlyValue(version));
}
