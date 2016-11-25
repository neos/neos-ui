import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import TextInput from './index.js';

storiesOf('TextInput', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => {
            const isValid = boolean('Is valid?', true);
            return (
                <StoryWrapper>
                    <TextInput
                        validationErrors={['This input is invalid']}
                        placeholder={isValid ? 'Valid input' : 'Invalid input'}
                        onChange={action('onChange')}
                        onFocus={action('onFocus')}
                        onBlur={action('onBlur')}
                        />
                </StoryWrapper>
            );
        },
        {inline: true}
    );
