import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {StoryWrapper} from './../_lib/storyUtils.js';
import SelectBox from './index.js';

const options = [
    {value: 'opt1', label: 'Option 1'},
    {value: 'opt2', label: 'Option 2'},
    {value: 'opt3', label: 'Option 3'}
];

const onSelect = o => {
    return console.log(o);
};

const loadOptions = ({value, callback}) => {
    setTimeout(() => (callback(options)), 1000);
};

storiesOf('SelectBox', module)
    .add('default', () => (
        <StoryWrapper title="SelectBox">
            <SelectBox
                options={options}
                placeholder="Select"
                placeholderIcon="search"
                onSelect={onSelect}
                />
        </StoryWrapper>
    ))
    .add('async', () => (
        <StoryWrapper title="SelectBox">
            <SelectBox
                options={loadOptions}
                placeholder="Select"
                placeholderIcon="search"
                onSelect={onSelect}
                />
        </StoryWrapper>
    ));
