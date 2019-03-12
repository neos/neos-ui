import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, boolean, text, select} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import Icon from '.';

storiesOf('Icon', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        'Font-awesome icon with some fancy options like spin, size and padding',
        () => (
            <StoryWrapper>
                <Icon
                    icon={text('Icon', 'search')}
                    size={select('Size', ['big', 'medium', 'small', 'tiny'], 'big')}
                    padded={select('Padded', ['none', 'left', 'right'], 'none')}
                    spin={boolean('Spin', false)}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    );
