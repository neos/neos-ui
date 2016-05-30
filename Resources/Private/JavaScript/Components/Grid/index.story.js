import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Grid from './index.js';
import GridItem from './GridItem/index.js';

storiesOf('Grid', module)
    .add('default', () => (
        <Grid>
            <GridItem width="33%">Item 1</GridItem>
            <GridItem width="33%">Item 2</GridItem>
            <GridItem width="33%">Item 3</GridItem>
            <GridItem width="33%">Item 4</GridItem>
            <GridItem width="33%">Item 5</GridItem>
            <GridItem width="33%">Item 6</GridItem>
        </Grid>
    ));
