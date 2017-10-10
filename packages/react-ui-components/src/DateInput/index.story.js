import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import DateInput from './index.js';

storiesOf('DateInput', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        'The DateInput selector. Allows to set a placeholder text.',
        () => (
            <StoryWrapper>
                <DateInput
                    placeholder={text('Placeholder', 'No date set')}
                    onChange={action('onChange')}
                    dateOnly={boolean('Date only', false)}
                    timeOnly={boolean('Time only', false)}
                    />
            </StoryWrapper>
        ),
        {inline: true, source: false}
    );
