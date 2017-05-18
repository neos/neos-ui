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

// TODO: remove
const loadOptions = ({callback, value, searchTerm}) => {
    if (value) {
        // simple search for async options
        const filteredOptions = options.filter(option => {
            return option.value === value;
        });

        setTimeout(() => (callback(filteredOptions)), 1000);
    } else if (searchTerm) {
        // simple search for async options
        const filteredOptions = options.filter(option => {
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
        'preselected value',
        () => (
            <StoryWrapper>
                <SelectBox
                    value={'opt1'}
                    options={options}
                    onValueChange={action('onValueChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'showing loading indicator with options filled (e.g. during AJAX search)',
        () => (
            <StoryWrapper>
                <SelectBox
                    value={'opt1'}
                    options={options}
                    onValueChange={action('onValueChange')}
                    displayLoadingIndicator={true}
                    placeholder={text('Placeholder', 'Select')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'showing loading indicator without options filled (e.g. on initial request)',
        () => (
            <StoryWrapper>
                <SelectBox
                    value={'opt1'}

                    onValueChange={action('onValueChange')}
                    displayLoadingIndicator={true}
                    placeholder={text('Placeholder', 'Select')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'no selected value should display placeholder',
        () => (
            <StoryWrapper>
                <SelectBox
                    options={options}
                    placeholder={text('Placeholder', 'Select')}
                    placeholderIcon={text('Placeholder icon', 'bookmark')}
                    onValueChange={action('onValueChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'search field is only shown if no value is selected',
        () => (
            <StoryWrapper>
                <SelectBox
                    options={options}
                    displaySearchBox={true}
                    searchTerm={'search term so far'}
                    onSearchTermChange={action('onSearchTermChange')}
                    onValueChange={action('onValueChange')}
                    placeholder="Placeholder string is ignored..."
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'search field is not shown if a value is selected, but "clear"-x is displayed then',
        () => (
            <StoryWrapper>
                <SelectBox
                    value={'opt2'}
                    options={options}
                    displaySearchBox={true}
                    onValueChange={action('onValueChange')}
                    placeholder="Placeholder string is ignored..."
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
    );
