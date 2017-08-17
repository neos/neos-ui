import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import TextArea from './index.js';

storiesOf('TextArea', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => {
            const isValid = boolean('Is valid?', true);
            return (
                <StoryWrapper>
                    <TextArea
                        validationErrors={isValid ? null : ['This input is invalid']}
                        placeholder={isValid ? 'Valid input' : 'Invalid input'}
                        onChange={action('onChange')}
                        onFocus={action('onFocus')}
                        onBlur={action('onBlur')}
                        highlight={boolean('Highlight', false)}
                        />
                </StoryWrapper>
            );
        },
        {inline: true}
    );
