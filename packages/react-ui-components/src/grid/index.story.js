import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Grid from './index.js';

storiesOf('Grid', module)
    .add('third', () => (
        <StoryWrapper title="Grid - Thirds">
            <Grid>
                <Grid.Col width="third">Item 1</Grid.Col>
                <Grid.Col width="third">Item 2</Grid.Col>
                <Grid.Col width="third">Item 3</Grid.Col>
                <Grid.Col width="third">Item 4</Grid.Col>
                <Grid.Col width="third">Item 5</Grid.Col>
                <Grid.Col width="third">Item 6</Grid.Col>
            </Grid>
        </StoryWrapper>
    ))
    .add('half', () => (
        <StoryWrapper title="Grid - Halves">
            <Grid>
                <Grid.Col width="half">Item 1</Grid.Col>
                <Grid.Col width="half">Item 2</Grid.Col>
                <Grid.Col width="half">Item 3</Grid.Col>
                <Grid.Col width="half">Item 4</Grid.Col>
                <Grid.Col width="half">Item 5</Grid.Col>
                <Grid.Col width="half">Item 6</Grid.Col>
            </Grid>
        </StoryWrapper>
    ));
