// import {version} from '../package.json';
import createManifestFunction from './manifest';

const createReadOnlyValue = (value: any) => ({
    value,
    writable: false,
    enumerable: false,
    configurable: true
});

interface ExposureMap {
    [propName: string]: any;
}
export default function createConsumerApi(manifests: any[], exposureMap: ExposureMap): void {
    const api = {};

    Object.keys(exposureMap).forEach(key => {
        Object.defineProperty(api, key, createReadOnlyValue(exposureMap[key]));
    });

    Object.defineProperty(api, '@manifest', createReadOnlyValue(
        createManifestFunction(manifests)
    ));

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
    // TODO: bring back VERSION
    // Object.defineProperty(window['@Neos:HostPluginAPI'], 'VERSION', createReadOnlyValue(version));
}
