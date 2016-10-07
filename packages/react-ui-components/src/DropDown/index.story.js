import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import DropDown from './index.js';

storiesOf('DropDown', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        '',
        () => (
            <StoryWrapper>
                <DropDown isOpen={true}>
                    <DropDown.Header>
                        {text('Header', 'Dropdown header')}
                    </DropDown.Header>
                    <DropDown.Contents>
                        {text('Contents', 'Dropdown contents')}
                    </DropDown.Contents>
                </DropDown>
            </StoryWrapper>
        ),
        {inline: true}
    );
