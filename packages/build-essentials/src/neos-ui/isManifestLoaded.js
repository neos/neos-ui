//
// Check if a manifest has been loaded
//
export default function isManifestLoaded(manifestIdentifier) {
    // ToDo: Write a getContext fn
    if (!window) {
        console.warn('Cannot check manifests, because browser environment is missing!');
        return false;
    }
    if (!window['@Neos:HostPluginAPI']) {
        console.warn('Cannot check manifests, because neos environment is missing!');
        return false;
    }
    if (!window['@Neos:HostPluginAPI']['@manifest']) {
        console.warn('Cannot check manifests, because neos environment is not set up properly (missing manifests)!');
        return false;
    }

    const manifests = window.__neosTestManifests;

    return manifests.filter(entry => entry[manifestIdentifier])[0] !== undefined;
}
