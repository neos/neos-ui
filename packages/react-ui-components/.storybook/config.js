import 'core-js/shim';

import {configure} from '@kadira/storybook';

const req = require.context('./../src', true, /story\.js$/);

function loadStories() {
    req.keys().forEach(req);
}

configure(loadStories, module);
