import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Label from './index.js';

storiesOf('Label', module)
    .add('default', () => (
        <StoryWrapper title="Label">
            <Label htmlFor="test">Test label</Label>
        </StoryWrapper>
    ));
