import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import CheckBox from './index.js';

storiesOf('CheckBox', module)
    .add('default', () => (
        <StoryWrapper title="CheckBox">
            <p>Unchecked:</p>
            <CheckBox onChange={action('onChange')} isChecked={false}/>
            <p>Checked:</p>
            <CheckBox onChange={action('onChange')} isChecked={true}/>
        </StoryWrapper>
    ));
