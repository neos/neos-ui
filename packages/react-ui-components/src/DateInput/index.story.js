import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {withKnobs, text, boolean} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import DateInput from '.';

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
                    todayLabel="Today"
                    />
            </StoryWrapper>
        ),
        {inline: true, source: false}
    )
    .addWithInfo(
        'dateOnly',
        'Date only DateInput selector.',
        () => (
            <StoryWrapper>
                <DateInput
                    placeholder={text('Placeholder', 'No date set')}
                    onChange={action('onChange')}
                    dateOnly={boolean('Date only', true)}
                    timeOnly={boolean('Time only', false)}
                    todayLabel="Today"
                    />
            </StoryWrapper>
        ),
        {inline: true, source: false}
    );
