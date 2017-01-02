import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Button from './index.js';

const validSizes = ['small', 'regular'];

storiesOf('Button', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        `The Button component. Toggle active and disabled states in the "knobs" section below.`,
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
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
                        isDisabled={boolean('Disabled', false)}
			size={select('Size', validSizes, 'regular')}
                        >
                        {text('Label', 'The Button')}
                    </Button>
                </div>
            </StoryWrapper>
        ),
        {inline: true}
    );
