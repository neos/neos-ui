import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Dialog from './index.js';
import Button from './../Button/index.js';

storiesOf('Dialog', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        'Dialog',
        () => (
            <StoryWrapper>
                <Dialog
                    isOpen={boolean('Is opened?', true)}
                    title={text('Title', 'Hello title!')}
                    onRequestClose={action('onRequestClose')}
                    actions={[
                        <Button key="foo">An action button</Button>
                    ]}
                    isWide
                    >
                    {text('Inner content', 'Hello world!')}
                </Dialog>
            </StoryWrapper>
        ),
        {inline: true, source: false}
    );
