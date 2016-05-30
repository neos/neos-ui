import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Headline from './index.js';

storiesOf('Headline', module)
    .add('default', () => (
        <div>
            <Headline type="h1">Heading 1</Headline>
            <Headline type="h2">Heading 2</Headline>
            <Headline type="h3">Heading 3</Headline>
            <Headline type="h4">Heading 4</Headline>
            <Headline type="h5">Heading 5</Headline>
            <Headline type="h6">Heading 6</Headline>
        </div>
    ));
