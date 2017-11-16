import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, select} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Grid from './index.js';

storiesOf('Grid', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => {
            const width = select('Width', ['half', 'third'], 'third');
            return (
                <StoryWrapper>
                    <Grid>
                        <Grid.Col width={width}>Item 1</Grid.Col>
                        <Grid.Col width={width}>Item 2</Grid.Col>
                        <Grid.Col width={width}>Item 3</Grid.Col>
                        <Grid.Col width={width}>Item 4</Grid.Col>
                        <Grid.Col width={width}>Item 5</Grid.Col>
                        <Grid.Col width={width}>Item 6</Grid.Col>
                    </Grid>
                </StoryWrapper>
            );
        },
        {inline: 'true'}
    );
