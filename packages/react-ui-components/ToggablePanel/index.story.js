import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import ToggablePanel from './index.js';

storiesOf('ToggablePanel', module)
    .add('stateful', () => (
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
    ))
    .add('stateless', () => (
        <div style={{background: 'rebeccapurple'}}>
            <ToggablePanel isOpen={true} togglePanel={action('toggle')}>
                <ToggablePanel.Header>
                    Header
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    Contents
                </ToggablePanel.Contents>
            </ToggablePanel>
        </div>
    ));
