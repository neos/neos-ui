import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import ToggablePanel from './index.js';

storiesOf('ToggablePanel', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'stateful',
        'ToggablePanel - Stateful',
        () => (
            <StoryWrapper>
                <ToggablePanel isOpen={boolean('Is Open?', true)}>
                    <ToggablePanel.Header>
                        Header
                    </ToggablePanel.Header>
                    <ToggablePanel.Contents>
                        Contents
                    </ToggablePanel.Contents>
                </ToggablePanel>
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'stateless',
        'ToggablePanel - Stateless',
        () => (
            <StoryWrapper>
                <ToggablePanel isOpen={boolean('Is Open?', true)} togglePanel={action('toggle')}>
                    <ToggablePanel.Header>
                        Header
                    </ToggablePanel.Header>
                    <ToggablePanel.Contents>
                        Contents
                    </ToggablePanel.Contents>
                </ToggablePanel>
            </StoryWrapper>
        ),
        {inline: true}
    );
