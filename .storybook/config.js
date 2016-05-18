import {configure} from '@kadira/storybook';

const req = require.context('./../Resources/Private/JavaScript', true, /story\.js$/);

function loadStories() {
    req.keys().forEach(req);
}

configure(loadStories, module);
