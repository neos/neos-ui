//
// Use this file for tests that need a bootstrapped Neos UI environment
//
// in the `ava` section of your package.json, add:
//
// {
//   "ava": {
//      "require": [
//          "@neos-project/build-essentials/src/setup-browser-env",
//          "@neos-project/build-essentials/src/setup-neos-ui-host-env"
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
