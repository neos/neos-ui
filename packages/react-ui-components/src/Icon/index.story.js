import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Icon from './index.js';

storiesOf('Icon', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        'Font-awesome icon with some fancy options like spin, size and padding',
        () => (
            <StoryWrapper>
                <Icon
                    icon={text('Icon', 'search')}
                    size={select('Size', ['big', 'small', 'tiny'], 'big')}
                    padded={select('Padded', ['none', 'left', 'right'], 'none')}
                    spin={boolean('Spin', false)}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    );
