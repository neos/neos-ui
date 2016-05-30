import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import IconButton from './index.js';

storiesOf('IconButton', module)
    .add('default', () => (
        <div>
            <IconButton icon="search" onClick={action('onClick')} style="lighter" />
        </div>
    ));
