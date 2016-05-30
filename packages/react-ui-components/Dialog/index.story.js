import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import Dialog from './index.js';

storiesOf('Dialog', module)
    .add('default', () => (
        <div>
            <Dialog
                isOpen={true}
                wide={true}
                title="Hello dialog!"
                onRequestClose={action('onRequestClose')}
                actions={[
                    <div>Button</div>
                ]}
                >
                H1ello world
            </Dialog>
            <div id="dialog" />
        </div>
    ));
