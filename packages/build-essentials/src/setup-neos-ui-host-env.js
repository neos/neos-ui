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
Object.defineProperty(window, '@Neos:HostPluginAPI', {
    value: {
        '@manifests': []
    },
    writable: false,
    enumerable: false,
    configurable: true
});
