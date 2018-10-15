import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {withKnobs, boolean} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import TextInput from '.';

storiesOf('TextInput', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => {
            const isValid = boolean('Is valid?', true);
            return (
                <StoryWrapper>
                    <TextInput
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
