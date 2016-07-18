import {logger} from 'Shared/Utilities/';

const API = window['@Neos:HostPluginAPI'];
const RECOMMENDED_VERSION = '1.0.0';
const isCompatibleVersion = () => true;

//
// Check for global neos API
//
if (API === undefined) {
    throw new Error('Neos Host Plugin API not found!');
}

//
// Check for version constraint
//
if (!isCompatibleVersion(API.version)) {
    logger.warn(`Detected incompatible Neos Host Plugin API "${API.version}", recommended: "${RECOMMENDED_VERSION}"`);
}

export default API;
