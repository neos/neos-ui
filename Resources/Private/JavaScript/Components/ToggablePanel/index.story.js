import React from 'react';
import {storiesOf} from '@kadira/storybook';
import ToggablePanel from './index.js';

storiesOf('ToggablePanel', module)
    .add('default', () => (
        <div>
            <ToggablePanel isOpened={true}>Panel contents</ToggablePanel>
        </div>
    ));
