//
// Use this file for tests that need a bootstrapped Neos UI environment
//
// in the `jest` section of your package.json, add:
//
// {
//   "jest": {
//      "preset": "@neos-project/jest-preset-neos-ui",
//      "setupFiles": [
//         "../../node_modules/@neos-project/jest-preset-neos-ui/src/setupNeosUiHostEnv.js"
//      ]
//   }
// }

window.__neosTestManifests = [];

Object.defineProperty(window, '@Neos:HostPluginAPI', {
    value: {
        '@manifest': (identifier, options, bootstrap) => window.__neosTestManifests.push({
            [identifier]: {
                options,
                bootstrap
            }
        })
    },
    writable: false,
    enumerable: false,
    configurable: true
});
