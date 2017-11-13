require('regenerator-runtime/runtime');
require('core-js/shim');
const browserEnv = require('browser-env');

browserEnv();
require('raf').polyfill();

window.fetch = () => Promise.resolve(null);
