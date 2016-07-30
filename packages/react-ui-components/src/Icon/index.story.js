import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Icon from './index.js';

storiesOf('Icon', module)
    .add('size', () => (
        <div>
            <div><Icon icon="search" size="big" /></div>
            <div><Icon icon="search" size="small" /></div>
            <div><Icon icon="search" size="tiny" /></div>
        </div>
    ))
    .add('padded', () => (
        <div>
            <div><Icon icon="search" padded="none" /></div>
            <div><Icon icon="search" padded="left" /></div>
            <div><Icon icon="search" padded="right" /></div>
        </div>
    ))
    .add('spin', () => (
        <div>
            <Icon icon="search" spin={true} />
        </div>
    ));
