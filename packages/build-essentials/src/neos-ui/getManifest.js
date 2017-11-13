//
// Get a loaded manifest
//
// ToDo: 80% duplicate code as in `isManifestLoaded.js`.
//
export default function getManifest(manifestIdentifier) {
    // ToDo: Write a getContext fn
    if (!window) {
        console.warn('Cannot retrieve manifests, because browser environment is missing!');
        return false;
    }
    if (!window['@Neos:HostPluginAPI']) {
        console.warn('Cannot retrieve manifests, because neos environment is missing!');
        return false;
    }
    if (!window['@Neos:HostPluginAPI']['@manifest']) {
        console.warn('Cannot retrieve manifests, because neos environment is not set up properly (missing manifests)!');
        return false;
    }

    const manifests = window.__neosTestManifests;

    // ToDo: Why not use find()?
    return manifests.filter(entry => entry[manifestIdentifier])[0][manifestIdentifier];
}
