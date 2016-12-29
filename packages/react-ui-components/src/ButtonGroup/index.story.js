import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import ButtonGroup from './index.js';
import IconButton from './../IconButton/index.js';

storiesOf('ButtonGroup', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        `The ButtonGroup component.`,
        () => (
            <StoryWrapper>
                <ButtonGroup value="one" onSelect={action('onSelect')}>
                    <IconButton
                        id="one"
                        style="lighter"
                        icon="level-up"
                        title="One, active"
                        />
                    <IconButton
                        id="two"
                        style="lighter"
                        icon="long-arrow-right"
                        isDisabled="true"
                        title="Two (disabled)"
                        />
                    <IconButton
                        id="three"
                        style="lighter"
                        icon="level-down"
                        title="Three"
                        />
                </ButtonGroup>
            </StoryWrapper>
        ),
        {inline: true}
    );
