import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import MultiSelectBox from './index.js';

const options = [
    {value: 'opt1', label: 'Option 1'},
    {value: 'opt2', label: 'Option 2'},
    {value: 'opt3', label: 'Option 3'}
];

const selectedOptions = [
    {value: 'opt1', label: 'Option 1'},
    {value: 'opt2', label: 'Option 2'}
];

const loadOptions = ({callback, value, searchTerm}) => {
    if (value) {
        // simple search for async options
        const filteredOptions = options.filter((option) => {
            return option.value == value;
        });

        setTimeout(() => (callback(filteredOptions)), 1000);
    } else if (searchTerm) {
        // simple search for async options
        const filteredOptions = options.filter((option) => {
            return option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });

        setTimeout(() => (callback(filteredOptions)), 1000);
    } else {
        setTimeout(() => (callback(options)), 1000);
    }
};

storiesOf('MultiSelectBox', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => (
            <StoryWrapper>
                <MultiSelectBox
                    options={options}
                    placeholder={text('Placeholder', 'Select')}
                    placeholderIcon={text('Placeholder icon', 'bookmark')}
                    onSelect={action('onSelect')}
                />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'defaultWithSelectedOptions',
        () => (
            <StoryWrapper>
                <MultiSelectBox
                    selectedOptions={selectedOptions}
                    options={options}
                    placeholder={text('Placeholder', 'Select')}
                    placeholderIcon={text('Placeholder icon', 'bookmark')}
                    onSelect={action('onSelect')}
                />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'asyncOptions',
        () => (
            <StoryWrapper>
                <MultiSelectBox
                    options={loadOptions}
                    placeholder={text('Placeholder', 'Select')}
                    placeholderIcon={text('Placeholder icon', 'bookmark')}
                    onSelect={action('onSelect')}
                />
            </StoryWrapper>
        ),
        {inline: true}
    );
