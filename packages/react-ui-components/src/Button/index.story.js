import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Button from './index.js';

storiesOf('Button', module)
    .add('states', () => (
        <StoryWrapper title="Button - States">
            <Button onClick={action('onClick')}>Normal state</Button>
            <Button onClick={action('onClick')} isActive={true}>Active</Button>
            <Button onClick={action('onClick')} isDisabled={true}>Disabled</Button>
            <Button onClick={action('onClick')} isFocused={true}>Focused</Button>
        </StoryWrapper>
    ))
    .add('styles', () => (
        <StoryWrapper title="Button - Styles">
            <div style={{backgroundColor: 'yellow'}}>
                <Button onClick={action('onClick')} style="clean">Clean button</Button>
                <Button onClick={action('onClick')} style="lighter">Lighter button</Button>
                <Button onClick={action('onClick')} style="brand" hoverStyle="brand">Brand button</Button>
                <Button onClick={action('onClick')} style="transparent">Transparent button</Button>
            </div>
        </StoryWrapper>
    ))
    .add('mouseover styles', () => (
        <StoryWrapper title="Button - Mouseover-Styles">
            <Button onClick={action('onClick')} hoverStyle="clean">Hover clean</Button>
            <Button onClick={action('onClick')} hoverStyle="darken">Hover darken</Button>
            <Button onClick={action('onClick')} hoverStyle="brand">Hover brand</Button>
        </StoryWrapper>
    ))
    .add('events', () => (
        <StoryWrapper title="Button - Events">
            <Button onClick={action('onClick')}>onClick</Button>
            <Button onClick={action('onClick')} onMouseEnter={action('onMouseEnter')}>onMouseEnter</Button>
            <Button onClick={action('onClick')} onMouseLeave={action('onMouseLeave')}>onMouseLeave</Button>
            <Button onClick={action('onClick')} onMouseDown={action('onMouseDown')}>onMouseDown</Button>
            <Button onClick={action('onClick')} onMouseUp={action('onMouseUp')}>onMouseUp</Button>
        </StoryWrapper>
    ));
