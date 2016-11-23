import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import IconButtonDropDown from './index.js';
import Icon from './../Icon/index.js';

storiesOf('IconButtonDropDown', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        'Click and hold for dropdown to appear',
        () => (
            <StoryWrapper>
                <IconButtonDropDown
                    icon={text('icon', 'plus')}
                    modeIcon={text('modeIcon', 'long-arrow-right')}
                    onClick={action('onClick')}
                    onItemSelect={action('onItemSelect')}
                    >
                    <Icon dropDownId="prepend" icon="level-up"/>
                    <Icon dropDownId="insert" icon="long-arrow-right"/>
                    <Icon dropDownId="append" icon="level-down"/>
                </IconButtonDropDown>
            </StoryWrapper>
        ),
        {inline: true}
    );
