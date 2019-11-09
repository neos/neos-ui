import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {withKnobs, text, boolean, select} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import Button from '.';

const validSizes = ['small', 'regular'];

storiesOf('Button', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        `Button component. Toggle active and disabled states in the "knobs" section below.`,
        () => (
            <StoryWrapper>
                <div>
                    <span style={{color: 'white'}}>Default: </span>
                    <Button
                        style="clean"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Clean')}</span>
                    </Button>
                    <Button
                        style="brand"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Brand')}</span>
                    </Button>
                    <Button
                        style="lighter"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Lighter')}</span>
                    </Button>
                    <Button
                        style="neutral"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Neutral')}</span>
                    </Button>
                    <Button
                        style="transparent"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Transparent')}</span>
                    </Button>
                </div>
                <div>
                    <span style={{color: 'white'}}>Hover clean: </span>
                    <Button
                        style="clean"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Clean')}</span>
                    </Button>
                    <Button
                        style="brand"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Brand')}</span>
                    </Button>
                    <Button
                        style="lighter"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Lighter')}</span>
                    </Button>
                    <Button
                        style="neutral"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Neutral')}</span>
                    </Button>
                    <Button
                        style="transparent"
                        hoverStyle="clean"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Transparent')}</span>
                    </Button>
                </div>
                <div>
                    <span style={{color: 'white'}}>Hover brand: </span>
                    <Button
                        style="clean"
                        hoverStyle="brand"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Clean')}</span>
                    </Button>
                    <Button
                        style="brand"
                        hoverStyle="brand"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Brand')}</span>
                    </Button>
                    <Button
                        style="lighter"
                        hoverStyle="brand"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Lighter')}</span>
                    </Button>
                    <Button
                        style="neutral"
                        hoverStyle="brand"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Neutral')}</span>
                    </Button>
                    <Button
                        style="transparent"
                        hoverStyle="brand"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Transparent')}</span>
                    </Button>
                </div>
                <div>
                    <span style={{color: 'white'}}>Hover darken: </span>
                    <Button
                        style="clean"
                        hoverStyle="darken"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Clean')}</span>
                    </Button>
                    <Button
                        style="brand"
                        hoverStyle="darken"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Brand')}</span>
                    </Button>
                    <Button
                        style="lighter"
                        hoverStyle="darken"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Lighter')}</span>
                    </Button>
                    <Button
                        style="neutral"
                        hoverStyle="darken"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Neutral')}</span>
                    </Button>
                    <Button
                        style="transparent"
                        hoverStyle="darken"
                        onClick={action('onClick')}
                        isPressed
                        onMouseEnter={action('onMouseEnter')}
                        onMouseLeave={action('onMouseLeave')}
                        onMouseDown={action('onMouseDown')}
                        onMouseUp={action('onMouseUp')}
                        isActive={boolean('Active', false)}
                        disabled={boolean('Disabled', false)}
                        size={select('Size', validSizes, 'regular')}
                    >
                        <span>{text('Label', 'Button Transparent')}</span>
                    </Button>
                </div>
            </StoryWrapper>
        ),
        {inline: true}
    );
