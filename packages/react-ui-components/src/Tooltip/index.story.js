import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, text} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import Tooltip from '.';

storiesOf('Tooltip', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => (
            <StoryWrapper>
                <Tooltip>{text('Tooltip', 'Test tooltip')}</Tooltip>
            </StoryWrapper>
        ),
        {inline: true}
    );
