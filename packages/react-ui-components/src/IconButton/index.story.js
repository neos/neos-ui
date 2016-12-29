import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, select} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import IconButton from './index.js';

const validStyleKeys = ['clean', 'brand', 'lighter', 'transparent'];
const validHoverStyleKeys = ['clean', 'brand', 'darken'];
const validSizes = ['small', 'regular'];

storiesOf('IconButton', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => (
            <StoryWrapper>
                <IconButton
                    icon={text('Icon', 'close')}
                    onClick={action('onClick')}
                    style={select('Style', validStyleKeys, 'clean')}
                    size={select('Size', validSizes, 'regular')}
                    hoverStyle={select('Hover style', validHoverStyleKeys, 'clean')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    );
