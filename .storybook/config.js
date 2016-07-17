import 'babel-polyfill';
import 'Shared/Styles/style.css';
import 'Host/style.css';

import {configure} from '@kadira/storybook';

const req = require.context('./../Resources/Private/JavaScript/Components', true, /story\.js$/);

function loadStories() {
    req.keys().forEach(req);
}

configure(loadStories, module);
