import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Bar from './index.js';

storiesOf('Bar', module)
    .add('default', () => (
        <div>
            <Bar position="top">
                Top bar
            </Bar>
            <Bar position="bottom">
                Bottom bar
            </Bar>
        </div>
    ));
