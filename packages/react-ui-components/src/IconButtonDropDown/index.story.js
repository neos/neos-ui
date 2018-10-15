import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {withKnobs, text} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import IconButtonDropDown from '.';
import Icon from './../Icon';

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
                    <Icon dropDownId="prepend" icon="level-up-alt"/>
                    <Icon dropDownId="insert" icon="long-arrow-alt-right"/>
                    <Icon dropDownId="append" icon="level-down-alt"/>
                </IconButtonDropDown>
            </StoryWrapper>
        ),
        {inline: true}
    );
