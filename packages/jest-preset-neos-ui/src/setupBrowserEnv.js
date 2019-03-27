import 'core-js/shim';
import 'regenerator-runtime/runtime';
const browserEnv = require('browser-env');

browserEnv();
require('raf').polyfill();
require('raf').polyfill(global);

window.fetch = () => Promise.resolve(null);
