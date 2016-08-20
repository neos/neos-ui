import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import ToggablePanel from './index.js';

storiesOf('ToggablePanel', module)
    .add('stateful', () => (
        <StoryWrapper title="ToggablePanel - Stateful">
            <ToggablePanel isOpen={true}>
                <ToggablePanel.Header>
                    Header
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    Contents
                </ToggablePanel.Contents>
            </ToggablePanel>
        </StoryWrapper>
    ))
    .add('stateless', () => (
        <StoryWrapper title="ToggablePanel - Stateless">
            <ToggablePanel isOpen={true} togglePanel={action('toggle')}>
                <ToggablePanel.Header>
                    Header
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    Contents
                </ToggablePanel.Contents>
            </ToggablePanel>
        </StoryWrapper>
    ));
