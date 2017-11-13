require('regenerator-runtime/runtime');
require('core-js/shim');
const browserEnv = require('browser-env');

browserEnv();
require('raf').polyfill();
require('raf').polyfill(global);

window.fetch = () => Promise.resolve(null);
