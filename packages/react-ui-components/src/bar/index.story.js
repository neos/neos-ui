import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Bar from './index.js';

storiesOf('Bar', module)
    .add('default', () => (
        <StoryWrapper title="Bar">
            <Bar position="top">
                Top bar
            </Bar>
            <Bar position="bottom">
                Bottom bar
            </Bar>
        </StoryWrapper>
    ));
