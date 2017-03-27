import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils.js';
import SelectBox from './index.js';
import DropDown from './../DropDown/index.js';

const options = [
    {value: 'opt1', label: 'Option 1'},
    {value: 'opt2', label: 'Option 2'},
    {value: 'opt3', label: 'Option 3'}
];

const loadOptions = ({callback, value, searchTerm}) => { // TODO change api -> value / searchTerm
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

storiesOf('SelectBox', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => (
            <StoryWrapper>
                <SelectBox
                    value={"opt1"}
                    options={options}
                    placeholder={text('Placeholder', 'Select')}
                    placeholderIcon={text('Placeholder icon', 'bookmark')}
                    onSelect={action('onSelect')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo( // TODO: fix story, option 2 is selected, dropdown contains only this option
        'async',
        () => (
            <StoryWrapper title="SelectBox">
                <SelectBox
                    value={"opt2"}
                    options={loadOptions}
                    placeholder={text('Placeholder', 'Select')}
                    onSelect={action('onSelect')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'inside dropdown',
        () => (
            <StoryWrapper title="SelectBox">
                <DropDown isOpen={true}>
                    <DropDown.Header>
                        Dropdown header
                    </DropDown.Header>
                    <DropDown.Contents>
                        <SelectBox
                            options={options}
                            placeholder={text('Placeholder', 'Select')}
                            placeholderIcon={text('Placeholder icon', 'search')}
                            onSelect={action('onSelect')}
                            />
                    </DropDown.Contents>
                </DropDown>
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'searchable',
        () => (
            <StoryWrapper title="SelectBox">
                <SelectBox
                    options={options}
                    placeholder={text('Placeholder', 'Type to search')}
                    onSelect={action('onSelect')}
                    onDelete={action('onDelete')}
                />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'searchableAsync',
        () => (
            <StoryWrapper title="SelectBox">
                <SelectBox
                    value={"opt1"}
                    options={loadOptions}
                    placeholder={text('Placeholder', 'Type to search')}
                    onSelect={action('onSelect')}
                    onDelete={action('onDelete')}
                />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'searchableAsyncWithLoadOnInputAndValu',
        () => (
            <StoryWrapper title="SelectBox">
                <SelectBox
                    value={"opt1"}
                    options={loadOptions}
                    placeholder={text('Placeholder', 'Type to search')}
                    onSelect={action('onSelect')}
                    onDelete={action('onDelete')}
                    loadOptionsOnInput={true}
                />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'searchableAsyncWithLoadOnInput',
        () => (
            <StoryWrapper title="SelectBox">
                <SelectBox
                    options={loadOptions}
                    placeholder={text('Placeholder', 'Type to search')}
                    onSelect={action('onSelect')}
                    onDelete={action('onDelete')}
                    loadOptionsOnInput={true}
                />
            </StoryWrapper>
        ),
        {inline: true}
    );
