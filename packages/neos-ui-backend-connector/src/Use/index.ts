//
// Add plugin to the api
//
export default (addLibrary: (identifier: string, instance: any) => void, api: any) => (plugin: any) => addLibrary(plugin.identifier, plugin(api));
