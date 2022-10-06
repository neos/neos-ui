import 'regenerator-runtime/runtime';
import browserEnv from 'browser-env';

browserEnv();

window.fetch = () => Promise.resolve(null);
