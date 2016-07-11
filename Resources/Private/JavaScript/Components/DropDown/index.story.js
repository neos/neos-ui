import React from 'react';
import {storiesOf} from '@kadira/storybook';
import DropDown from './index.js';

storiesOf('DropDown', module)
    .add('default', () => (
        <DropDown isOpen={true}>
            <DropDown.Header>
                Dropdown header
            </DropDown.Header>
            <DropDown.Contents>
                Dropdown contents
            </DropDown.Contents>
        </DropDown>
    ));
