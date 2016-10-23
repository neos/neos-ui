//
// Check if a manifest has been loaded
//
export default function isManifestLoaded(manifestIdentifier) {
    if (!window) {
        console.warn('Cannot check manifests, because browser environment is missing!');
        return false;
    }
    if (!window['@Neos:HostPluginAPI']) {
        console.warn('Cannot check manifests, because neos environment is missing!');
        return false;
    }
    if (!window['@Neos:HostPluginAPI']['@manifests']) {
        console.warn('Cannot check manifests, because neos environment is not set up properly (missing manifests)!');
        return false;
    }

    const manifests = window['@Neos:HostPluginAPI']['@manifests'];

    return manifests.filter(entry => entry[manifestIdentifier])[0] !== undefined;
}
