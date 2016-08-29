import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import SelectBox from './index.js';

const options = [
    {value: "opt1", label: "Option 1"},
    {value: "opt2", label: "Option 2"},
    {value: "opt3", label: "Option 3"},
];

const onSelect = (o) => {
    return console.log(o);
};

storiesOf('SelectBox', module)
    .add('default', () => (
        <StoryWrapper title="SelectBox">
            <SelectBox options={options} placeholder="Select" onSelect={onSelect} />
        </StoryWrapper>
    ));
