import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import IconButton from './index.js';

storiesOf('IconButton', module)
    .add('default', () => (
        <StoryWrapper title="IconButton">
            <IconButton icon="close" onClick={action('onClick')} style="lighter"/>
        </StoryWrapper>
    ));
