// tslint:disable:class-name
import React, {PureComponent} from 'react';
import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine';

const CREATE_NEW_IS_FOCUSED = 'NEOS_UI_CREATE_NEW_IS_FOCUSED';

interface SelectedOption {
    readonly [key: string]: typeof CREATE_NEW_IS_FOCUSED;
}

interface SelectBox_CreateNew_Props {
    // For explanations of the PropTypes, see SelectBox.js
    readonly optionValueField: string;
    readonly searchTerm?: string;
    readonly onSearchTermChange: (searchTerm: string) => void;
    readonly onCreateNew: (value: string) => void;
    readonly createNewLabel?: string;

    // API with SelectBox
    readonly focusedValue?: string;
    readonly onOptionFocus: (selectedOption: SelectedOption) => void;
}

/**
 * **SelectBox_CreateNew is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox_ListPreview as the last list element; and it is rendered if the `onCreateNew`
 * prop is specified.
 */
export default class SelectBox_CreateNew extends PureComponent<SelectBox_CreateNew_Props> {
    public render(): JSX.Element | null {
        const {
            searchTerm,
            onCreateNew,
            createNewLabel,
            focusedValue
        } = this.props;
        const isHighlighted = focusedValue === CREATE_NEW_IS_FOCUSED;
        const isCreateNewEnabled = onCreateNew && searchTerm;

        if (!isCreateNewEnabled) {
            return null;
        }

        return (
            <SelectBox_Option_SingleLine
                option={{label: `${createNewLabel} "${searchTerm}"`, icon: 'plus-circle'}}
                key={'___createNew'}
                isHighlighted={isHighlighted}
                onClick={this.handleCreateNew}
                onMouseEnter={this.handleMouseEnter}
            />
        );
    }

    private readonly handleCreateNew = () => {
        const {
            searchTerm,
            onSearchTermChange,
            onCreateNew
        } = this.props;

        if (searchTerm && searchTerm.length) {
            onCreateNew(searchTerm);
        }
        // Clear search box on creating new
        onSearchTermChange('');
    }

    private readonly handleMouseEnter = () => {
        const {
            optionValueField,
            onOptionFocus
        } = this.props;

        const selectedOption: SelectedOption = {
            [optionValueField]: CREATE_NEW_IS_FOCUSED
        };

        onOptionFocus(selectedOption);
    }
}
