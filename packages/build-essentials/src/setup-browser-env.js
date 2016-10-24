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
import browserEnv from 'browser-env';

browserEnv();

import 'core-js';

window.fetch = () => Promise.resolve(null);
