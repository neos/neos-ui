import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Portal from './index.js';

storiesOf('Portal', module)
    .add('default', () => (
        <Portal isOpen={true}><div>Test portal</div></Portal>
    ));
