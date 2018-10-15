import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {withKnobs, text} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import MultiSelectBox from '.';

const options = [
    {value: 'opt1', label: 'Option 1'},
    {value: 'opt2', label: 'Option 2', icon: 'bookmark'},
    {value: 'opt3', label: 'Option 3'}
];

storiesOf('MultiSelectBox', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'preselected values',
        () => (
            <StoryWrapper>
                <MultiSelectBox
                    values={['opt1']}
                    options={options}
                    searchOptions={options}
                    onValuesChange={action('onValuesChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'allowEmpty=false with more than one element should display "x" next to the elements',
        () => (
            <StoryWrapper>
                <MultiSelectBox
                    allowEmpty={false}
                    values={['opt1', 'opt2']}
                    options={options}
                    searchOptions={options}
                    onValuesChange={action('onValuesChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'allowEmpty=false with one element should not display "x" next to the element',
        () => (
            <StoryWrapper>
                <MultiSelectBox
                    allowEmpty={false}
                    values={['opt1']}
                    options={options}
                    searchOptions={options}
                    onValuesChange={action('onValuesChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'showing loading indicator with options filled (e.g. during AJAX search)',
        () => (
            <StoryWrapper>
                <MultiSelectBox
                    values={['opt1']}
                    options={options}
                    onValuesChange={action('onValuesChange')}
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
                <MultiSelectBox
                    values={['opt1']}

                    onValuesChange={action('onValuesChange')}
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
                <MultiSelectBox
                    options={options}
                    placeholder={text('Placeholder', 'Select')}
                    placeholderIcon={text('Placeholder icon', 'bookmark')}
                    onValuesChange={action('onValuesChange')}
                    />
            </StoryWrapper>
        ),
        {inline: true}
    );
