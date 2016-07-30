import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Grid from './index.js';
import GridItem from './GridItem/index.js';

storiesOf('Grid', module)
    .add('third', () => (
        <Grid>
            <GridItem width="third">Item 1</GridItem>
            <GridItem width="third">Item 2</GridItem>
            <GridItem width="third">Item 3</GridItem>
            <GridItem width="third">Item 4</GridItem>
            <GridItem width="third">Item 5</GridItem>
            <GridItem width="third">Item 6</GridItem>
        </Grid>
    ))
    .add('half', () => (
        <Grid>
            <GridItem width="half">Item 1</GridItem>
            <GridItem width="half">Item 2</GridItem>
            <GridItem width="half">Item 3</GridItem>
            <GridItem width="half">Item 4</GridItem>
            <GridItem width="half">Item 5</GridItem>
            <GridItem width="half">Item 6</GridItem>
        </Grid>
    ));
