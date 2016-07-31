import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Portal from './index.js';

storiesOf('Portal', module)
    .add('default', () => (
        <StoryWrapper title="Portal">
            <Portal isOpen={true}><div>Test portal</div></Portal>
        </StoryWrapper>
    ));
