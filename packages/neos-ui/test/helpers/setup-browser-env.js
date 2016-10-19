import browserEnv from 'browser-env';
browserEnv();

import 'core-js';

window.fetch = () => Promise.resolve(null);
