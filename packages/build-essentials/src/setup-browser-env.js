//
// Use this file for tests that need a browser environment
//
// in the `ava` section of your package.json, add:
//
// {
//   "ava": {
//      "require": [
//          "@neos-project/build-essentials/src/setup-browser-env"
//      ]
//   }
// }
import 'regenerator-runtime/runtime';
import 'core-js/shim';
import browserEnv from 'browser-env';

browserEnv();


window.fetch = () => Promise.resolve(null);
