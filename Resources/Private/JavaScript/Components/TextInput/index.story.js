import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import TextInput from './index.js';

storiesOf('TextInput', module)
    .add('default', () => (
        <div>
            <TextInput
                isValid={true}
                placeholder="Valid input"
                onChange={action('onChange')}
                onFocus={action('onFocus')}
                onBlur={action('onBlur')}
               />
            <TextInput
                isValid={false}
                placeholder="Invalid input"
                onChange={action('onChange')}
                onFocus={action('onFocus')}
                onBlur={action('onBlur')}
               />
        </div>
    ));
