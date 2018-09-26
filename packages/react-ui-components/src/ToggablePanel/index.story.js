import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {withKnobs, boolean} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import ToggablePanel from '.';

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
        'stateful - closing towards bottom',
        'ToggablePanel - Closing towards bottom',
        () => (
            <StoryWrapper>
                <div style={{height: '200px', display: 'flex', flexDirection: 'column'}}>
                    <div style={{flexBasis: '100%', color: 'white'}}>
                        Upper container, to push down ToggablePanel
                    </div>
                    <ToggablePanel isOpen={boolean('Is Open?', true)} closesToBottom={boolean('Closes towards bottom?', true)}>
                        <ToggablePanel.Header>
                            Header
                        </ToggablePanel.Header>
                        <ToggablePanel.Contents>
                            Contents
                        </ToggablePanel.Contents>
                    </ToggablePanel>
                </div>
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'stateless',
        'ToggablePanel - Stateless',
        () => (
            <StoryWrapper>
                <ToggablePanel isOpen={boolean('Is Open?', true)} onTogglePanel={action('toggle')}>
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
