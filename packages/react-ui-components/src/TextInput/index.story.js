import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import TextInput from './index.js';

storiesOf('TextInput', module)
    .add('default', () => (
        <StoryWrapper title="TextInput">
            <TextInput
                isValid={true}
                placeholder="Valid input"
                onChange={action('onChange')}
                onFocus={action('onFocus')}
                onBlur={action('onBlur')}
                />
            <TextInput
                isValid={false}
                placeholder="Invalid input"
                onChange={action('onChange')}
                onFocus={action('onFocus')}
                onBlur={action('onBlur')}
                />
        </StoryWrapper>
    ));
