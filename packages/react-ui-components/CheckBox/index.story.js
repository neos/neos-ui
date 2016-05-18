import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import CheckBox from './index.js';

storiesOf('CheckBox', module)
    .add('default', () => (
        <div>
            <p>Unchecked:</p>
            <CheckBox onChange={action('onChange')}/>
            <p>Checked:</p>
            <CheckBox onChange={action('onChange')} isChecked={true}/>
        </div>
    ));
