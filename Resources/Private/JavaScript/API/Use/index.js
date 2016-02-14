//
// Add plugin to the api
//
export default (addLibrary, api) => plugin => addLibrary(plugin.identifier, plugin(api));
