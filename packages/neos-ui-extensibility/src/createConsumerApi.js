import manifest from './manifest';

const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: false
});

export default function createConsumerApi (exposureMap) {
    const api = {
        manifest,
        ...exposureMap
    };

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
}
