import 'core-js/shim';
import infoAddon from '@storybook/addon-info';

import {configure, setAddon} from '@storybook/react';

const req = require.context('./../src', true, /story\.js$/);

function loadStories() {
    req.keys().forEach(req);
}

setAddon(infoAddon);

configure(loadStories, module);
