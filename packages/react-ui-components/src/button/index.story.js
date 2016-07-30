import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import Button from './index.js';

storiesOf('Button', module)
    .add('states', () => (
        <div>
            <Button onClick={action('onClick')}>Normal state</Button>
            <Button onClick={action('onClick')} isActive={true}>Active</Button>
            <Button onClick={action('onClick')} isDisabled={true}>Disabled</Button>
            <Button onClick={action('onClick')} isFocused={true}>Focused</Button>
        </div>
    ))
    .add('background styles', () => (
        <div style={{backgroundColor: 'yellow'}}>
            <Button onClick={action('onClick')} style="clean">Clean button</Button>
            <Button onClick={action('onClick')} style="lighter">Lighter button</Button>
            <Button onClick={action('onClick')} style="brand" hoverStyle="brand">Brand button</Button>
            <Button onClick={action('onClick')} style="transparent">Transparent button</Button>
        </div>
    ))
    .add('hover styles', () => (
        <div>
            <Button onClick={action('onClick')} hoverStyle="clean">Hover clean</Button>
            <Button onClick={action('onClick')} hoverStyle="darken">Hover darken</Button>
            <Button onClick={action('onClick')} hoverStyle="brand">Hover brand</Button>
        </div>
    ))
    .add('events', () => (
        <div>
            <Button onClick={action('onClick')}>onClick</Button>
            <Button onClick={action('onClick')} onMouseEnter={action('onMouseEnter')}>onMouseEnter</Button>
            <Button onClick={action('onClick')} onMouseLeave={action('onMouseLeave')}>onMouseLeave</Button>
            <Button onClick={action('onClick')} onMouseDown={action('onMouseDown')}>onMouseDown</Button>
            <Button onClick={action('onClick')} onMouseUp={action('onMouseUp')}>onMouseUp</Button>
        </div>
    ));
