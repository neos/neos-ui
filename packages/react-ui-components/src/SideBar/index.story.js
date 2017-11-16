import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, select} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import SideBar from './index.js';

storiesOf('SideBar', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => {
            const position = select('Position', ['left', 'right'], 'left');
            return (
                <StoryWrapper>
                    <div style={{position: 'relative', minHeight: '50vh'}}>
                        <SideBar position={position}>Sidebar position: {position}</SideBar>
                    </div>
                </StoryWrapper>
            );
        },
        {inline: true}
    );
