import React from 'react';
import {storiesOf} from '@kadira/storybook';
import ToggablePanel from './index.js';

storiesOf('ToggablePanel', module)
    .add('default', () => (
        <div style={{background: 'rebeccapurple'}}>
            <ToggablePanel isOpen={true}>
                <ToggablePanel.Header>
                    Header
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    Contents
                </ToggablePanel.Contents>
            </ToggablePanel>
        </div>
    ));
