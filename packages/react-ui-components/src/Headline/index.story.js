import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, select} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import Headline from '.';

storiesOf('Headline', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => {
            const type = select('Headline type', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], 'h1');
            return (
                <StoryWrapper>
                    <Headline type={type}>Heading level: {type}</Headline>
                </StoryWrapper>
            );
        },
        {inline: true}
    );
