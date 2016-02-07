//
// Add plugin to the api
//
export default (addLibrary, api) => plugin => addLibrary(plugin.name, plugin(api));
