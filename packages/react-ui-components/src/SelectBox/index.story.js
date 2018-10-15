import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {withKnobs, text} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import SelectBox from '.';
import DropDown from './../DropDown';

const optionsWithoutGroups = [
    {value: 'opt1', label: 'Option 1', icon: 'bookmark'},
    {value: 'opt2', label: 'Option 2'},
    {value: 'opt3', label: 'Option 3'},
    {value: 'opt4', label: 'Option 4'}
];
const optionsWithExactlyOneGroup = [
    {value: 'opt1', label: 'Option 1', icon: 'bookmark', group: 'Group 1'},
    {value: 'opt2', label: 'Option 2', group: 'Group 1'},
    {value: 'opt3', label: 'Option 3', group: 'Group 1'},
    {value: 'opt4', label: 'Option 4'}
];
const optionsWithAllItemsInSameGroup = [
    {value: 'opt1', label: 'Option 1', icon: 'bookmark', group: 'Group 1'},
    {value: 'opt2', label: 'Option 2', group: 'Group 1'},
    {value: 'opt3', label: 'Option 3', group: 'Group 1'},
    {value: 'opt4', label: 'Option 4', group: 'Group 1'}
];
const optionsWithMultipleGroups = [
    {value: 'opt1', label: 'Option 1', icon: 'bookmark', group: 'Group 1'},
    {value: 'opt2', label: 'Option 2', group: 'Group 2'},
    {value: 'opt3', label: 'Option 3', group: 'Group 1'},
    {value: 'opt4', label: 'Option 4'}
];

storiesOf('SelectBox', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'Create new option',
        () => (
            <StoryWrapper>
                <SelectBox
                    options={optionsWithMultipleGroups}
                    onValueChange={action('onValueChange')}
                    onCreateNew={action('onCreateNew')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'Grouping with multiple groups',
        () => (
            <StoryWrapper>
                <SelectBox
                    options={optionsWithMultipleGroups}
                    onValueChange={action('onValueChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'Grouping with exactly one group',
        () => (
            <StoryWrapper>
                <SelectBox
                    options={optionsWithExactlyOneGroup}
                    onValueChange={action('onValueChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'Grouping with all items in the same group',
        () => (
            <StoryWrapper>
                <SelectBox
                    options={optionsWithAllItemsInSameGroup}
                    onValueChange={action('onValueChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'Grouping without groups',
        () => (
            <StoryWrapper>
                <SelectBox
                    options={optionsWithoutGroups}
                    onValueChange={action('onValueChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'preselected value',
        () => (
            <StoryWrapper>
                <SelectBox
                    value={'opt1'}
                    options={optionsWithoutGroups}
                    onValueChange={action('onValueChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'preselected value with allowEmpty displays "clear"-x icon.',
        () => (
            <StoryWrapper>
                <SelectBox
                    value={'opt1'}
                    options={optionsWithoutGroups}
                    allowEmpty={true}
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
                    options={optionsWithoutGroups}
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
                    options={optionsWithoutGroups}
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
                    options={optionsWithoutGroups}
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
                    options={optionsWithoutGroups}
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
                            options={optionsWithoutGroups}
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
