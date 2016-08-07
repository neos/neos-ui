import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import DropDown from './index.js';

storiesOf('DropDown', module)
    .add('default', () => (
        <StoryWrapper title="DropDown">
            <DropDown isOpen={true}>
                <DropDown.Header>
                    Dropdown header
                </DropDown.Header>
                <DropDown.Contents>
                    Dropdown contents
                </DropDown.Contents>
            </DropDown>
        </StoryWrapper>
    ));
