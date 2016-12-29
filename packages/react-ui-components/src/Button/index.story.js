import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Button from './index.js';

const validStyleKeys = ['clean', 'brand', 'lighter', 'transparent'];
const validHoverStyleKeys = ['clean', 'brand', 'darken'];
const validSizes = ['small', 'regular'];

storiesOf('Button', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        `The Button component.`,
        () => (
            <StoryWrapper>
                <Button
                    isActive={boolean('Active', false)}
                    isDisabled={boolean('Disabled', false)}
                    isFocused={boolean('Focused', false)}
                    style={select('Style', validStyleKeys, 'clean')}
                    size={select('Size', validSizes, 'regular')}
                    hoverStyle={select('Hover style', validHoverStyleKeys, 'clean')}
                    onClick={action('onClick')}
                    onMouseEnter={action('onMouseEnter')}
                    onMouseLeave={action('onMouseLeave')}
                    onMouseDown={action('onMouseDown')}
                    onMouseUp={action('onMouseUp')}
                    >
                    {text('Label', 'The Button')}
                </Button>
            </StoryWrapper>
        ),
        {inline: true}
    );
