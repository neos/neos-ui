import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import IconButtonDropDown from './index.js';
import Icon from './../icon/index.js';

storiesOf('IconButtonDropDown', module)
    .add('default', () => (
        <StoryWrapper title="IconButtonDropDown">
            <IconButtonDropDown
                icon="plus"
                modeIcon="long-arrow-right"
                onClick={action('onClick')}
                onItemSelect={action('onItemSelect')}
                >
                <Icon dropDownId="prepend" icon="long-arrow-up"/>
                <Icon dropDownId="insert" icon="long-arrow-right"/>
                <Icon dropDownId="append" icon="long-arrow-down"/>
            </IconButtonDropDown>
        </StoryWrapper>
    ));
