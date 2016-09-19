import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';
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
                        isValid={isValid}
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
