import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import IconButtonDropDown from './index.js';
import Icon from './../Icon/index.js';

storiesOf('IconButtonDropDown', module)
    .add('default', () => (
        <div>
            <IconButtonDropDown
                icon="plus"
                modeIcon="long-arrow-right"
                onClick={action('onClick')}
                onItemSelect={action('onItemSelect')}
                >
                <Icon dropDownId="prepend" icon="long-arrow-up" />
                <Icon dropDownId="insert" icon="long-arrow-right" />
                <Icon dropDownId="append" icon="long-arrow-down" />
            </IconButtonDropDown>
        </div>
    ));
