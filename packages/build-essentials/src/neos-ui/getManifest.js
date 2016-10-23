//
// Get a loaded manifest
//
export default function getManifest(manifestIdentifier) {
    if (!window) {
        console.warn('Cannot retrieve manifests, because browser environment is missing!');
        return false;
    }
    if (!window['@Neos:HostPluginAPI']) {
        console.warn('Cannot retrieve manifests, because neos environment is missing!');
        return false;
    }
    if (!window['@Neos:HostPluginAPI']['@manifests']) {
        console.warn('Cannot retrieve manifests, because neos environment is not set up properly (missing manifests)!');
        return false;
    }

    const manifests = window['@Neos:HostPluginAPI']['@manifests'];

    return manifests.filter(entry => entry[manifestIdentifier])[0][manifestIdentifier];
}
