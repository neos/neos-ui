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

const loadOptions = ({callback}) => {
    setTimeout(() => (callback(options)), 1000);
};

storiesOf('SelectBox', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        () => (
            <StoryWrapper>
                <SelectBox
                    options={options}
                    placeholder={text('Placeholder', 'Select')}
                    placeholderIcon={text('Placeholder icon', 'search')}
                    onSelect={action('onSelect')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'async',
        () => (
            <StoryWrapper title="SelectBox">
                <SelectBox
                    options={loadOptions}
                    placeholder={text('Placeholder', 'Select')}
                    placeholderIcon={text('Placeholder icon', 'search')}
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
        'deleteable',
        () => (
            <StoryWrapper title="SelectBox">
                <SelectBox
                    options={loadOptions}
                    placeholder={text('Placeholder', 'Select')}
                    onSelect={action('onSelect')}
                    onDelete={action('onDelete')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    );
