import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import Dialog from './index.js';

storiesOf('Dialog', module)
    .add('default', () => (
        <StoryWrapper title="Dialog">
            <Dialog
                isOpen={true}
                wide={true}
                title="Hello dialog!"
                onRequestClose={action('onRequestClose')}
                actions={[
                    <div>Button</div>
                ]}
                >
                Hello world
            </Dialog>
            <div id="dialog" />
        </StoryWrapper>
    ));
