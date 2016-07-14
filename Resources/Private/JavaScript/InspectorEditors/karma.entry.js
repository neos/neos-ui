//
// This file serves as the main entry file for karma.
// It will require all files ending with `.spec.js`
// and compiles them with webpack on the fly.
//
// The regular configuration for karma generates a webpack bundle for each test spec,
// this would result in a lot of big compiled files which need to be compibled indepedently.
//
// Instead, this way of requiring all spec files results in one big test bundle webpack
// needs to compile, which is a lot faster than the default configuration.
//
const context = require.context('./src', true, /.js$/);

//
// Shim Neos Host Plugin APi
//
window['@Neos:HostPluginAPI'] = {
    createInspectorEditor: () => {},
    createHook: () => {},

    //
    // Shim Neos runtime dependencies, React is shimmed via alias
    //
    ['@Neos:RuntimeDependencies']: {
        Components: {},
        I18n: {},
        SecondaryInspector: {},
        api: {}
    }
};

context.keys().forEach(context);
