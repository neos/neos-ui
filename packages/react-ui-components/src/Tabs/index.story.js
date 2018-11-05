import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import Tabs from '.';

storiesOf('Tabs', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => (
            <StoryWrapper>
                <Tabs>
                    <Tabs.Panel title="Tab 1" icon="search">Tab 1 contents</Tabs.Panel>
                    <Tabs.Panel title="Tab 2" icon="search">Tab 2 contents</Tabs.Panel>
                </Tabs>
            </StoryWrapper>
        ),
        {inline: true}
    );
