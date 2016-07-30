import React from 'react';
import {storiesOf} from '@kadira/storybook';
import SideBar from './index.js';

storiesOf('SideBar', module)
    .add('default', () => (
        <div>
            <SideBar position="left">Left sidebar</SideBar>
            <SideBar position="right">Right sidebar</SideBar>
        </div>
    ));
