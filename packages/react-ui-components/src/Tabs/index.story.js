import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Tabs from './index.js';

storiesOf('Tabs', module)
    .add('default', () => (
        <div>
            <Tabs>
                <Tabs.Panel title="Tab 1" icon="search">Tab 1 contents</Tabs.Panel>
                <Tabs.Panel title="Tab 2" icon="search">Tab 2 contents</Tabs.Panel>
            </Tabs>
        </div>
    ));
