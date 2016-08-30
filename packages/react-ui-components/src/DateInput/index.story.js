import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import DateInput from './index.js';

storiesOf('DateInput', module)
    .add('default', () => (
        <StoryWrapper title="DateInput">
            <DateInput
                placeholder="No date set"
                onChange={action('onChange')}
                />
        </StoryWrapper>
    ))
    .add('with value', () => (
        <StoryWrapper title="DateInput">
            <DateInput
                placeholder="No date set"
                value={new Date()}
                onChange={action('onChange')}
                />
        </StoryWrapper>
    ));
