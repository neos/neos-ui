import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import DropDown from './index.js';

const validStyles = ['default', 'darker'];

storiesOf('DropDown', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        '',
        () => (
            <StoryWrapper>
                <DropDown
                    isOpen={true}
                    padded={boolean('Padded', false)}
                    style={select('Size', validStyles)}
                    >
                    <DropDown.Header>
                        {text('Header', 'Dropdown header')}
                    </DropDown.Header>
                    <DropDown.Contents scrollable={boolean('Scrollable', true)}>
                        {text('Contents', 'Dropdown contents')}
                    </DropDown.Contents>
                </DropDown>
            </StoryWrapper>
        ),
        {inline: true}
    );
