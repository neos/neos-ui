import createRuntimeDependencies from './Dependencies/index';

export const API_INSTANCE_NAME = '@Neos:HostPluginAPI';

const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: false
});

export default (api, inspectorEditorRegistry) => {
    const pluginApi = {
        createInspectorEditor: (moduleName, legacyName, factory) => {
            inspectorEditorRegistry.register(moduleName, legacyName, factory);
        },
        ...api
    };

    Object.defineProperty(pluginApi, '@Neos:RuntimeDependencies', createReadOnlyValue(
        createRuntimeDependencies(api)
    ));
    Object.defineProperty(window, API_INSTANCE_NAME, createReadOnlyValue(pluginApi));
};
