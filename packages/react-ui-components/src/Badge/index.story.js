import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, text} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Badge from './index.js';

storiesOf('Badge', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        `The Badge component.`,
        () => (
            <StoryWrapper>
                <div>
                    <Badge label={text('text', 'the badge')}/>
                </div>
            </StoryWrapper>
        ),
        {inline: true}
    );
