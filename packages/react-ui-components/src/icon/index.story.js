import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Icon from './index.js';

storiesOf('Icon', module)
    .add('size', () => (
        <StoryWrapper title="Icon">
            <div><Icon icon="search" size="big"/></div>
            <div><Icon icon="search" size="small"/></div>
            <div><Icon icon="search" size="tiny"/></div>
        </StoryWrapper>
    ))
    .add('padded', () => (
        <StoryWrapper title="Icon - padded">
            <div><Icon icon="search" padded="none"/> This icon is not padded</div>
            <div>This icon is padded on the left side <Icon icon="search" padded="left"/></div>
            <div><Icon icon="search" padded="right"/> This icon is padded on the right side</div>
        </StoryWrapper>
    ))
    .add('spin', () => (
        <StoryWrapper title="Icon - Spinning">
            <Icon icon="search" spin={true}/>
        </StoryWrapper>
    ));
