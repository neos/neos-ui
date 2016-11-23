import 'core-js/shim';
import infoAddon from '@kadira/react-storybook-addon-info';

import {configure, setAddon} from '@kadira/storybook';

const req = require.context('./../src', true, /story\.js$/);

function loadStories() {
    req.keys().forEach(req);
}

setAddon(infoAddon);

configure(loadStories, module);
