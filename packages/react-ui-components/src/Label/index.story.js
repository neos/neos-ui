import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Label from './index.js';

storiesOf('Label', module)
    .add('default', () => (
        <div>
            <Label htmlFor="test">Test label</Label>
        </div>
    ));
