import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import SideBar from './index.js';

storiesOf('SideBar', module)
    .add('default', () => (
        <StoryWrapper title="SideBar">
            <SideBar position="left">Left sidebar</SideBar>
            <SideBar position="right">Right sidebar</SideBar>
        </StoryWrapper>
    ));
