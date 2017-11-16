import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {withKnobs, boolean} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import CheckBox from './index.js';

storiesOf('CheckBox', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        'Just a checkbox. Can be checked or not.',
        () => (
            <StoryWrapper>
                <CheckBox onChange={action('onChange')} isChecked={boolean('Checked', true)}/>
            </StoryWrapper>
        ),
        {inline: true}
    );
